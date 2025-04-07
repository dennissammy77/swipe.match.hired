document.addEventListener("DOMContentLoaded",async function(){
    const jobsContainer = document.getElementById("jobs-container");
    //const jobs = JSON.parse(localStorage.getItem('jobListings')) || await fetchListings().then(()=>window.location.reload());
    const jobs = await fetchJobListings();
    class SwiperHandler {
        constructor(container) {
            this.container = container;
            this.setup();
            this.savedJobListings = JSON.parse(localStorage.getItem('savedJobListings')) || [];
        }
        setup() {
            this.container.innerHTML = ``;
        
            // Create Swiper container
            this.swiperContainer = document.createElement('div');
            this.swiperContainer.classList.add('swiper');
            
            // Create Swiper wrapper and store it as a class property
            this.swiperWrapper = document.createElement('div');
            this.swiperWrapper.classList.add('swiper-wrapper');

            // Append wrapper inside container
            this.swiperContainer.appendChild(this.swiperWrapper);
            this.container.appendChild(this.swiperContainer);
        }
        addCard(job) {
            const card = document.createElement('div');
            card.classList.add("swiper-slide","border", "box-shadow-md","p-4");
            this.createJobContents(job.title, job.postAt, job.company.name, job.company.logo, job.location,job.saved,card);
            this.swiperWrapper.appendChild(card);
            const hammer = new Hammer(card);
            hammer.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL  });
            hammer.on("doubletap", (event) => {
                console.log(event)
                this.saveJob(job,event,card);
            });
            hammer.on("swipeup", () => window.open(job.url, "_blank"));
        }
        createJobContents(title, date, name, logo, location,saved,card){
            // date
            const timeBadge = document.createElement("div")
            timeBadge.textContent = `${this.formatTimestamp(date)}`;
            timeBadge.classList.add("job-time-badge");
            // add a saved button element if exysts on job
            if(saved){
                const savedButton = document.createElement("button");
                savedButton.textContent = "Saved ❤️";
                savedButton.classList.add("btn-custom-secondary","box-shadow-md","border");
                savedButton.style="position: absolute; top: 10px; right: 10px;";
                card.appendChild(savedButton);
            }
            // company logo
            const logoElement = document.createElement("img");
            logoElement.src = logo;
            logoElement.alt = "logo";
            logoElement.classList.add("job-logo");
            // title
            const titleElement = document.createElement("h2");
            titleElement.textContent = title;
            titleElement.classList.add("job-title");
            // position company details at bottom of the card
            const companyDetails = document.createElement("div");
            companyDetails.classList.add("job-company-details");
            companyDetails.innerHTML=`
                <img src="${logo}" alt="logo" class="job-logo" width="50px" height="50px" class="rounded"/>
                <div class="d-flex flex-column mx-2 align-items-start">
                    <p class="company-name mb-0">${name}</p>
                    <p class="company-location mb-0 text-custom-xs">${location}</p>
                </div>
            `
            // Append all elements to the card
            card.appendChild(timeBadge);
            card.appendChild(titleElement);
            card.appendChild(companyDetails);
        };
        async saveJob(job,event,card){
            const heart = document.createElement("span");
            const rect = card.getBoundingClientRect(); // Get the card's position and size
            let x = event.center.x - rect.left;
            let y = event.center.y - rect.top;
            console.log(x,y);

            heart.textContent = "❤️";
            heart.classList.add("save-job");
            heart.style.left = `${x > rect.width/2 ? rect.width - x : x}px`;
            heart.style.top = `${Math.abs(y)}px`;

            card.appendChild(heart);
            // save job to db
            await saveJob({
                jobDetails: JSON.stringify(job), 
                jobId: job.id,
                savedAt: new Date(Date.now()),
                coverLetter: '', // cover letter created by AI
                resumeUrl: '', // resume created by AI
                atsScore: 0, // score created by AI
                status: "saved" // e.g. "Applied", "Interviewed", "Offered", "Declined"
            });
            setTimeout(() => {
                heart.style.opacity = 0;
                setTimeout(() => {
                    card.removeChild(heart);
                }, 800);
            }, 1000);
        };
        formatTimestamp(timestamp) {
            let date = new Date(timestamp);
            let options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
            };
            return date.toLocaleString('en-US', { ...options, timeZone: 'Africa/Nairobi' });
        }
        initSwiper() {
            this.swiper = new Swiper(this.swiperContainer, {
                effect: "cards",
                grabCursor: true,
                initialSlide: 0,
                speed: 1000,
                rotate: true,
                mousewheel: {
                    invert: false,
                },
            });
        }
    };

    if (jobs && jobs.length > 0) {
        displayJobCards()
    } else {
        jobsContainer.innerHTML = `
            <p class="text-xxxl m-auto">No jobs found. <br>Try a different search!</p>
        `;
    }
    
    // Function to display jobs
    function displayJobCards() {
        const swiperController = new SwiperHandler(jobsContainer);
        jobs.forEach(job => {
            swiperController.addCard(job);
        });
        // Initialize Swiper AFTER cards are added
        swiperController.initSwiper();
    }
})