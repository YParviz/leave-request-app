const supabase = window.supabase.createClient(
    'https://swqmlmrxaiesskxahzjn.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cW1sbXJ4YWllc3NreGFoempuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzEyNTAsImV4cCI6MjA2MDc0NzI1MH0.d1gCibKEqldG7wqklutWBUlx8sQ2kz3yuVGG1VBMa60',
    {
      auth: {
        persistSession: true,
        storage: window.sessionStorage
      }
    }
  );
  
  // Charger automatiquement les managers dans la liste déroulante
  async function chargerManagers() {
    const { data: managers, error } = await supabase
      .from("profils")
      .select("email, nom")
      .eq("role", "manager");
  
    if (error) {
      console.error("Erreur chargement managers:", error.message);
      return;
    }
  
    const select = document.getElementById("manager");
    managers.forEach(manager => {
      const option = document.createElement("option");
      option.value = manager.email;
      option.textContent = `${manager.nom} (${manager.email})`;
      select.appendChild(option);
    });
  }
  
  // Exécuter au chargement de la page
  window.addEventListener("DOMContentLoaded", chargerManagers);
  
  // Gérer la soumission du formulaire
  document.getElementById("signup-btn").addEventListener("click", async () => {
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const manager = document.getElementById("manager").value;
  
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
  
    if (signUpError) {
      document.getElementById("message").innerText = "Erreur : " + signUpError.message;
      return;
    }
  
    // Petite pause pour que l'utilisateur soit bien connecté
    setTimeout(async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
  
      if (!userId) {
        document.getElementById("message").innerText = "Erreur : utilisateur non trouvé.";
        return;
      }
  
      const { error: insertError } = await supabase
        .from("profils")
        .insert([{ id: userId, nom: nom, email: email, manager: manager, role: 'employe' }]);
  
      if (insertError) {
        document.getElementById("message").innerText = "Erreur insertion : " + insertError.message;
        return;
      }
  
      document.getElementById("message").innerText = "Inscription réussie ! Redirection...";
      setTimeout(() => window.location.href = "demande.html", 1000);
    }, 1000);
  });
  