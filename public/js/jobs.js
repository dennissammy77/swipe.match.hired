document.addEventListener("DOMContentLoaded",async function(){
    const jobsContainer = document.getElementById("jobs-container");
    const jobs = JSON.parse(localStorage.getItem('jobListings')) || await fetchJobListings();
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
            this.createJobContents(job.title, job.postAt, job.company.name, job.company.logo, job.location,card);
            this.swiperWrapper.appendChild(card);
            const hammer = new Hammer(card);
            hammer.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL  });
            hammer.on("doubletap", (event) => {
                console.log(event)
                this.saveJob(job,event,card);
            });
            hammer.on("swipeup", () => window.open(job.url, "_blank"));
        }
        createJobContents(title, date, name, logo, location,card){
            // date
            const timeBadge = document.createElement("div")
            timeBadge.textContent = `${this.formatTimestamp(date)}`;
            timeBadge.classList.add("job-time-badge");
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
        saveJob(job,event,card){
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

            this.savedJobListings.push(job);
            localStorage.setItem('savedJobListings', JSON.stringify(this.savedJobListings));
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
            <div class="center-div">
                <p class="text-xxxl">No jobs found. <br>Try a different search!</p>
            </div>
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