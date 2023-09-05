const socket = io();

const nombre = prompt('Ingrese su nombre');

socket.on('bienvenida', (data) => {
    console.log(data.message);
    socket.emit('identificacion', nombre);
});

socket.on('idCorrecto', (data) => {
    console.log(data.message);
});

const cargaAutos = () => {
    fetch('/autos')
        .then((data) => {
            return data.json();
        })
        .then((autos) => {
            let ul = '';
            autos.forEach((auto) => {
                ul += `<li>${auto.marca}</li>`;
            });

            let ulautos = document.getElementById('autos');
            ulautos.innerHTML = ul;
        });
};

socket.on('nuevoAuto', (auto, autos) => {
    console.log(`Se ha dado de alta a ${auto.marca}`);
    let ul = '';
    autos.forEach((auto) => {
        ul += `<li>${auto.modelo}</li>`;
    });

    let ulautos = document.getElementById('autos');
    ulautos.innerHTML = ul;
});

cargaAutos();
