document.querySelector('registroForm').addEventListener('submit', function(event) {
    

    const nombre = document.querySelector('.nombre').value;
    const apellido = document.querySelector('.apellido').value;
    const correo = document.querySelector('.correo').value;
    const contrasena = document.querySelector('.contrasena').value;
    const telefono = document.querySelector('.telefono').value;
    const tipo = document.querySelector('.tipo').value;

    const request = indexedDB.open('miBaseDeDatos', 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore('usuarios', { keyPath: 'id', autoIncrement:true });
        objectStore.createIndex('nombre', 'nombre', { unique: false });
        objectStore.createIndex('apellido', 'apellido', { unique: false });
        objectStore.createIndex('correo', 'correo', { unique: true });
        objectStore.createIndex('contrasena', 'contrasena', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('tipo', 'tipo', { unique: false });
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['usuarios'], 'readwrite');
        const objectStore = transaction.objectStore('usuarios');
        objectStore.add({
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            contrasena: contrasena,
            telefono: telefono,
            tipo: tipo
        });

        alert('Usuario registrado con éxito!');
    };
});
