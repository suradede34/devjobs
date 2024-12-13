const cardContents = document.querySelector(".cardContents");
const filterTitle = document.querySelector(".filterTitle");
const filterLocation = document.querySelector(".filterLocation");
const searchBtn = document.querySelector(".searchBtn");
const switchh = document.querySelector(".switch");
const container = document.querySelector(".container");

async function fetchJobs({ fTitle = "", fLocation = "", fullTimeOnly = false }) {
  const response = await fetch("/assets/json/data.json").then((res) => res.json());
  const filteredJobs = response
    .filter((job) =>
      job.position.toLowerCase().includes(fTitle.toLowerCase()) ||
      job.company.toLowerCase().includes(fTitle.toLowerCase())
    )
    .filter((job) => job.location.toLowerCase().includes(fLocation.toLowerCase()))
    .filter((job) => (fullTimeOnly ? job.contract.includes("Full Time") : true));


  cardContents.innerHTML = filteredJobs
    .map( //veriyi almak, burada yardim aldim
      (job) => `
        <div class="card ${switchh.checked ? "dark-mode" : ""}">
          <img src="${job.logo}" alt="${job.company}" />
          <span class="metadata">${job.postedAt} . ${job.contract}</span>
          <h2 class="jobPosition" data-id="${job.id}">${job.position}</h2>
          <span class="company">${job.company}</span>
          <span class="country">${job.location}</span>
        </div>
      `
    )
    .join("");

  return filteredJobs;
}

function showJobDetails(jobData) {
  const { location, logo, contract, position, company, postedAt, website, description, requirements, role } = jobData;
  container.innerHTML = `
    <div class="jobDetails ${switchh.checked ? "dark-mode" : ""}">
      <div class="top-content">
        <div class="job-logo"><img src="${logo}" alt="${company}" /></div>
        <div class="company-text">
          <span class="companyName">${company}</span>
          <span class="companySite">${website}</span>
        </div>
        <button class="companyBtn">Company Site</button>
      </div>
      <div class="bottom-content">
        <div class="bottom-header">
          <div class="header-text">
            <span class="topText">${postedAt} . ${contract}</span>
            <h2 class="jobTitle">${position}</h2>
            <span class="jobLocation">${location}</span>
          </div>
          <button class="applyNowBtn">Apply Now</button>
        </div>
        <div class="jobExplanation">
          <p class="jobDescription">${description}</p>
          <h3 class="jobRequirements">Requirements</h3>
          <p class="jobRequirementsText">${requirements.content}</p>
          <ul class="jobRequirementsList">
            ${requirements.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <h3 class="jobWhatYouWillDo">What You Will Do</h3>
          <p class="jobWhatYouWillDoText">${role.content}</p>
          <ol class="jobWhatYouWillDoList">
            ${role.items.map((item) => `<li>${item}</li>`).join("")} 
          </ol>
        </div>
      </div>
    </div>
  `;
}

//bazi yerlerde yardim aldim yapamadim calismdi
fetchJobs({}).then((response) => {
  const jobPositions = document.querySelectorAll(".jobPosition");
  
  jobPositions.forEach((jobPosition) => {
    jobPosition.addEventListener("click", function () {
      const jobId = this.getAttribute("data-id");
      const jobData = response.find((job) => job.id == jobId);
      showJobDetails(jobData);
    });
  });

});