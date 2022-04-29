class FiltersList {
  constructor(jobsData) {
    this.filtersOn = [];
    this.filtersCardElem = document.querySelector(".filter.card");
    this.jobsData = jobsData;
  }

  filterVisability() {
    if (this.filtersOn.length) {
      this.filtersCardElem.classList.remove("hiddenOpacity");
    } else {
      this.filtersCardElem.classList.add("hiddenOpacity");
    }
  }

  addFilter(filter) {
    if (this.filtersOn.indexOf(filter) === -1) {
      document.querySelector(".filter .filters").innerHTML += `
      <li class="l-gray-cyan-bg-bg" id="filter-${filter}" filter="${filter}">
        <span>${filter}</span>
        <button class="remove l-gray-cyan-bg-clr d-desaturated-cyan-bg font-xsm bold" id="remove-${filter}">
        X
        </button>
      </li>
      `
      this.filtersOn.push(filter);
      ;
    }
    this.filterVisability();
    this.applyFilters();
  }

  removeFilter(filter){
    if (this.filtersOn.indexOf(filter) != -1) {
      this.filtersOn.splice(this.filtersOn.indexOf(filter), 1);
      document.querySelector(`#filter-${filter}`).remove();
    }
    this.filterVisability();
    this.applyFilters();
  }

  clearFilters() {
    for (const filter of this.filtersOn) {
      this.removeFilter(filter);
    }
  }

  applyFilters() {
    let filteredJobs = [...this.jobsData];
    for (const filter of this.filtersOn) {
      filteredJobs = filteredJobs.filter((job) => {
      let categories = [job.role, job.level, ...job.languages, ...job.tools];
      if (categories.indexOf(filter) === -1) { return false; }
      return true;
      });
    }
    document.querySelector(".cards").innerHTML = "";
    renderUi(filteredJobs, this);
  }
}

function renderUi(data, filterObj) {
  const cardsParent = document.querySelector(".cards");
  for (const job of data) {
      cardsParent.innerHTML += `
    <div class="card job-card white-bg" id="card-${job.id}">
      <div class="info">
        <div class="logo-wrap">
          <img src="${job.logo}" alt="${job.company}">
        </div>
        <div class="text-wrap">
          <div class="company">
            <h2 class="name d-desaturated-cyan-clr font-xsm bold">
              ${job.company}
            </h2>
            <span class="features l-gray-cyan-ft-clr">
            </span>
          </div>
          <h3 class="position font-sm bold">
          ${job.position}
          </h3>
          <div class="tags d-gray-cyan-clr font-xsm">
            <span>
            ${job.postedAt}
            </span>
            <hr>
            <span>
            ${job.contract}
            </span>
            <hr>
            <span>
            ${job.location}
            </span>
          </div>
        </div>
      </div>
      <div class="categories d-desaturated-cyan-clr font-xsm bold">
        <ul></ul>
      </div>
    </div>
    `
      let jobCard = document.querySelector(`#card-${job.id}`);
      if (job.new) {
          jobCard.querySelector(".features").innerHTML += `
          <span class="d-desaturated-cyan-bg font-xxsm bold">
            NEW!
          </span>
          `;
      }

      if (job.featured) {
        jobCard.classList.add("featured");
        jobCard.querySelector(".features").innerHTML += `
        <span class="vd-gray-cyan-bg font-xxsm bold">
          FEATURED
        </span>
        `;
      }

      let jobCategories = [job.role, job.level, ...job.languages, ...job.tools]
      let categories = jobCard.querySelector(".categories ul");

      for (const category of jobCategories) {
        categories.innerHTML += `
        <li class="l-gray-cyan-bg-bg" category="${category}">${category}</li>
        `;
      }

      let filterClear = document.querySelector(".filter .clear");
      filterClear.addEventListener("click", () => {
        filterObj.clearFilters();
      });
  }

  
  let categoryLists = document.querySelectorAll(".categories ul");
  let filterList = document.querySelector(".filter .filters");

  for (const list of categoryLists) {
    list.addEventListener("click", (e) => {
      let category = e.target.getAttribute("category");
      if (category) {
        filterObj.addFilter(category);
      }
    });
  }

  filterList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove")) {
      filterObj.removeFilter(e.target.id.split("-")[1]);
    }
  });
}

fetch("http://192.168.1.106:8080/api")
.then(data => data.json())
.then((jsonData) =>  {
  const filter = new FiltersList(jsonData);
  renderUi(jsonData, filter)
})
.catch(err => console.log(err));
