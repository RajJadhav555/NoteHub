
      async function deleteHelper() {
          const confirmation = prompt("⚠️ DANGER ZONE ⚠️\n\nThis will PERMANENTLY delete your account and remove you from all groups.\nYour notes will remain securely stored.\n\nType 'DELETE' to confirm:");
          
          if (confirmation === 'DELETE') {
              try {
                  const res = await fetch(`${API_BASE_URL}/auth/users/me`, {
                       method: 'DELETE',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({ userId: studentId })
                  });
                  
                  const data = await res.json();
                  
                  if (res.ok) {
                      alert("Account deleted. We're sad to see you go! 👋");
                      doLogout();
                  } else {
                      alert(`Failed to delete account: ${data.error || 'Unknown error'}`);
                  }
              } catch(e) {
                  console.error("Delete account error", e);
                  alert("Error deleting account: " + e.message);
              }
          }
      }
