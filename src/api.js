document.addEventListener("DOMContentLoaded",async function(){
    // Handle Display type i.e saved Jobs // allJobs
    let displayType = localStorage.getItem('displayType') || 'allJobs';
    displayType === 'allJobs'? document.getElementById('cancelSavedDb').classList.add('hidden') : document.getElementById('cancelSavedDb').classList.remove('hidden'); // 
    
    displayJobListings();
    // form to save job preferences
    document.getElementById("jobPreferences").addEventListener('submit',async(e)=>{
        e.preventDefault()
        
        let submitBtn = document.getElementById("saveBtn");
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Saving...`;
        const jobTitle =  document.getElementById("jobTitle").value.trim() || 'golang';
        
        if(!jobTitle){
            alert('No title passed')
            return
        }else{
            clearDb()
            await fetchListings(jobTitle);
            window.location.reload()
        }
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Save"; // Restore button text
        }, 3000);
    });
    // fetch cll
    async function fetchListings(jobTitle){
        localStorage.setItem('jobTitle', JSON.stringify(jobTitle));
        // https://linkedin-api8.p.rapidapi.com/search-jobs-v2?keywords=golang&locationId=92000000&datePosted=anyTime&sort=mostRelevant

        const url = `https://linkedin-api8.p.rapidapi.com/search-jobs-v2?keywords=${jobTitle}&locationId=100710459&datePosted=anyTime&sort=mostRelevant`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '8bb0b33c9fmsh5db3bc8c9645717p107dfdjsna5195e6d6c9e',
            'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
          }
        };
        
        try {
            // omly make request the first time
            if(!localStorage.getItem('jobListings')){
                const response = await fetch(url, options);
                const result = await response.json();
                if (result && result.data.length > 0) {
                    // Get the first 100 jobs or fewer if there aren't that many
                    const first100Jobs = result.data.slice(0, 100);
            
                    // Store in localStorage
                    localStorage.setItem('jobListings', JSON.stringify(first100Jobs));
            
                    // console.log('Jobs stored in localStorage:', result.data);
                } else {
                    console.log('No jobs found.');
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    // clear db
    document.getElementById("cleanDb").addEventListener('click',async()=>{
        clearDb();
        displayJobListings()
    });
    // saved jobs
    document.getElementById("savedDb").addEventListener('click',async(event)=>{
        event.preventDefault();
        localStorage.setItem('displayType', 'savedJobs');
        document.getElementById('cancelSavedDb').classList.remove('hidden');
        window.location.reload();
    });
    // show all jobs
    document.getElementById("cancelSavedDb").addEventListener('click',async(event)=>{
        event.preventDefault();
        localStorage.setItem('displayType', 'allJobs');
        document.getElementById('cancelSavedDb').classList.add('hidden')
        ToggleJobsVisibility();
        window.location.reload();
    });

    function clearDb(){
        localStorage.removeItem("jobListings");
        localStorage.removeItem("savedJobListings");
    };

    // display job listings
    function displayJobListings(){
        jobTitle.value = JSON.parse(localStorage.getItem('jobTitle'));
        
        const swiperWrapper = document.querySelector('.swiper-wrapper')
        let jobListings = JSON.parse(localStorage.getItem('jobListings')) || [];
        let savedJobListings = JSON.parse(localStorage.getItem('savedJobListings')) || [];
        const data = displayType === 'allJobs'? jobListings : savedJobListings;
        console.log(data)

        if(data.length > 0){
            data.sort((a, b) => new Date(b.postAt) - new Date(a.postAt));
            data.map((job)=>{
                let slide = document.createElement("div");
                slide.classList.add("swiper-slide","col","border", "box-shadow-md");    
                slide.style.backgroundColor = 'var(--primary)';
                slide.style.padding = '20px';
                slide.style.position = 'relative';
                slide.setAttribute('draggable',true);
    
                // add contents elements
                let timeBadge = document.createElement("div");
                timeBadge.textContent = `posted: ${formatTimestamp(job.postAt)}`;
                timeBadge.style.position = "absolute";
                timeBadge.style.top = "10px";
                timeBadge.style.right = "10px";
                timeBadge.style.background = "var(--secondary)";
                timeBadge.style.color = "#000";
                timeBadge.style.padding = "5px 10px";
                timeBadge.style.borderRadius = "5px";
                timeBadge.style.fontSize = "12px";
    
                // Job Title
                let jobTitle = document.createElement("h2");
                jobTitle.textContent = job.title || "Job Title";
                jobTitle.style.color = "#fff";
                jobTitle.style.textAlign = "center";
                jobTitle.style.fontSize = "xx-large";
                jobTitle.style.margin = "50px 0";
                   
    
                let companyDetailsDiv = document.createElement("div");
                companyDetailsDiv.classList.add('row','align-items-center')
                companyDetailsDiv.style.position = "absolute";
                companyDetailsDiv.style.bottom = "10px";
                companyDetailsDiv.style.left = "10px";
    
                // Company Logo Placeholder
                let companyLogo = document.createElement("img");
                companyLogo.style.width = "50px";
                companyLogo.style.height = "50px";
                companyLogo.style.border = "1px solid white";
                companyLogo.style.borderRadius = "5px";
                companyLogo.src = job.company.logo;
                companyLogo.alt = job.company.name;
    
    
                // Company Name
                let companyName = document.createElement("p");
                companyName.textContent = job.company.name || "Company Name";
                companyName.style.color = "var(--secondary)";
                companyName.style.fontSize = "large";
                companyName.style.fontWeight = "bold";
    
                // Location
                let jobLocation = document.createElement("p");
                jobLocation.textContent = job.location || "Location";
                jobLocation.style.color = "#fff";
                jobLocation.style.fontSize = "small";
    
                // Job Info Container
                let jobInfo = document.createElement("div");
                jobInfo.classList.add('col','mx-md')
                
                companyDetailsDiv.appendChild(companyLogo);
                jobInfo.appendChild(companyName);
                jobInfo.appendChild(jobLocation);
                companyDetailsDiv.appendChild(jobInfo);
    
                // Append elements to slide
                slide.appendChild(timeBadge);
                slide.appendChild(jobTitle);
                slide.appendChild(companyDetailsDiv);
                
                swiperWrapper.append(slide);
                
                slide.addEventListener("dblclick", function(event) {
                    if(displayType === 'allJobs'){
                        const heart = document.createElement("span");
                        console.log("Button double-clicked!");
                        heart.textContent = "❤️";
                        heart.style.position = "absolute";
                        heart.style.left = `${event.clientX}px`;
                        heart.style.top = `${event.clientY}px`;
                        heart.style.fontSize = "84px";
                        heart.style.zIndex = 1000;
                        heart.style.transition = "opacity 0.8s ease-out";
                        
                        document.querySelector(".cards-container").appendChild(heart);
                        savedJobListings.push(job);
                        localStorage.setItem('savedJobListings', JSON.stringify(savedJobListings));
                        // Remove heart after animation
                        setTimeout(() => {
                            heart.style.opacity = "0";
                            setTimeout(() => heart.remove(), 800);
                        }, 1000);
                    }

                    setTimeout(() => {
                        // route to view page
                        window.open(job.url, "_blank");
                    }, 1000);

                    // save job for a later time use a json server
                });
            });
        }else{
            // show no jobs found ui
            ToggleJobsVisibility()
        };
    };
    // toggle container visibility
    function ToggleJobsVisibility(){
        // show no jobs found ui
        document.querySelector('.no-jobs').classList.toggle('hidden')
        document.querySelector('.view-container').classList.toggle('hidden')
    }

    function formatTimestamp(timestamp) {
        let date = new Date(timestamp);
        // Format options
        let options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
        };    
        let eatTime = date.toLocaleString('en-US', { ...options, timeZone: 'Africa/Nairobi' });
    
        return eatTime;
    };

    const swiper = new Swiper(".swiper", {
        effect: "cards",
        grabcursor: true,
        initialSlide: 0,
        speed: 1000,
        rotate: true,
        // autoplay: {
        //     delay: 1000,
        // },
        mousewheel: {
            invert: false,
        },
    });

    window.swiper = swiper;
    
    document.getElementById("scroll-btn").addEventListener("click", function () {
        document.querySelector(".form-container").scrollIntoView({ behavior: "smooth" });
    });
})