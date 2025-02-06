let current_url = 'D:///persuratan/frontend';

async function loginAndSaveToken(username, password) {
    const url = 'http://127.0.0.1:5000/login'; // URL endpoint login

    // Membuat headers untuk Basic Auth
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(username + ":" + password)); // Encode username dan password ke Base64

    try {
        // Melakukan request POST ke endpoint login
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Login failed: ' + response.statusText);
        }

        // Mengambil token dari response
        const data = await response.json();
        const token = data.token;

        // Menyimpan token ke localStorage
        localStorage.setItem('authToken', token);
        //console.log('Token saved to localStorage:', token);

        return token;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

async function fetchProtectedData() {
    const url = 'http://127.0.0.1:5000/protected'; // URL endpoint yang dilindungi

    // Mengambil token dari localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error('No token found in localStorage. Please login first.');
        window.location.href = `${current_url}/login.html`;
        return;
    }

    try {
        // Melakukan request GET ke endpoint yang dilindungi dengan token
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token, // Mengirim token di header Authorization
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch protected data: ' + response.statusText);
        }

        // Mengambil data dari response
        const data = await response.json();
        // console.log('Protected data:', data);

        return data;
    } catch (error) {
        console.error('Error fetching protected data:', error);
        throw error;
    }
}


function keluar() {
    // Menghapus token dari localStorage
    localStorage.removeItem('authToken');
    console.log('Token has been cleared from localStorage.');
    window.location.href = `${current_url}/login.html`;
}


document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah form dari pengiriman default

    // Ambil nilai dari input
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeatPassword').value;

    // Validasi kecocokan password
    if (password !== repeatPassword) {
        document.getElementById('errorMessage').style.display = 'block';
        return; // Hentikan proses jika password tidak cocok
    } else {
        document.getElementById('errorMessage').style.display = 'none';
    }

    // Data yang akan dikirim ke API
    const data = {
        username: username,
        password: password
    };

    // Kirim data ke API
    fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        if (data.message == "Register berhasil!"){
            alert('Registration successful!');
            window.location.href = current_url + '/login.html'
        } else {
            alert(data.message);
        }
        // Redirect atau lakukan sesuatu setelah registrasi berhasil
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Registration failed! (Network)');
    });
});