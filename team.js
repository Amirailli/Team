document.addEventListener("DOMContentLoaded", function () {
    const projectForm = document.getElementById("projectForm");
    const category1Container = document.querySelector("#category1 .projects");
    const category2Container = document.querySelector("#category2 .projects");

    // 🔹 Récupération de l'identifiant unique de l'utilisateur
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = "user_" + Date.now(); // Générer un ID unique
        localStorage.setItem("userId", userId);
    }
    console.log("User ID:", userId);

    function showProjects() {
        document.getElementById("add-project").classList.add("hidden");
        document.getElementById("project-list").classList.remove("hidden");
    }

    function showAddProject() {
        document.getElementById("project-list").classList.add("hidden");
        document.getElementById("add-project").classList.remove("hidden");
    }

    window.showProjects = showProjects;
    window.showAddProject = showAddProject;

    function loadProjects() {
        const projects = JSON.parse(localStorage.getItem("projects")) || [];
        category1Container.innerHTML = "";
        category2Container.innerHTML = "";

        projects.forEach(proj => addProjectToPage(proj.id, proj.name, proj.github, proj.category, proj.owner));
    }

        function addProjectToPage(id, name, github, category, owner) {
            let projectDiv = document.createElement("div");
            projectDiv.classList.add("project");
            projectDiv.setAttribute("id", id); // Ajout de l'ID pour faciliter la suppression
            projectDiv.innerHTML = `<h3>${name}</h3>
                                    <a href="${github}" target="_blank">🔗 Voir sur GitHub</a>`;
        

        console.log(`Ajout projet: ${name}, Owner: ${owner}, Current User: ${userId}`);

        if (owner === userId) {
            let deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.innerText = "Supprimer";
            deleteBtn.onclick = function () {
                deleteProject(id);
            };
            projectDiv.appendChild(deleteBtn);
        }

        let categoryContainer = (category === "1") ? category1Container : category2Container;
        categoryContainer.prepend(projectDiv);
    }

    if (projectForm) {
        projectForm.addEventListener("submit", function(event) {
            event.preventDefault();

            let projectName = document.getElementById("projectName").value.trim();
            let githubLink = document.getElementById("githubLink").value.trim();
            let challengeCategory = document.getElementById("challengeCategory").value;

            if (projectName === "" || githubLink === "") {
                alert("Veuillez remplir tous les champs.");
                return;
            }

            let projectId = "proj_" + Date.now();

            const newProject = {
                id: projectId,
                name: projectName,
                github: githubLink,
                category: challengeCategory,
                owner: userId
            };

            const projects = JSON.parse(localStorage.getItem("projects")) || [];
            projects.unshift(newProject);
            localStorage.setItem("projects", JSON.stringify(projects));

            addProjectToPage(projectId, projectName, githubLink, challengeCategory, userId);
            projectForm.reset();
        });
    }

    function deleteProject(projectId) {
        let projects = JSON.parse(localStorage.getItem("projects")) || [];
        projects = projects.filter(proj => proj.id !== projectId); // Supprimer du localStorage
        localStorage.setItem("projects", JSON.stringify(projects));
    
        // Supprimer l'élément du DOM directement
        let projectElement = document.getElementById(projectId);
        if (projectElement) {
            projectElement.remove();
        }
    
        console.log(`Projet supprimé: ${projectId}`);
    }
});    
