// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open('vite-offline-cache').then((cache) => {
//             return cache.addAll([
//                 '/',
//                 "/logo_landing.svg",
//                 "/manifest.json",
//                 // Agrega aquí todas las rutas estáticas que quieras cachear
//                 '/assets/doctor_landing.png',
//                 '/assets/logo_landing.svg',
//                 '/assets/dentist4-home-icon1.png',
//                 '/assets/dentist4-home-icon2.png',
//                 '/assets/dentist4-home-icon3.png',
//                 // ... otros archivos estáticos ...
//             ]);
//         })
//     );
// });

// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             return response || fetch(event.request);
//         })
//     );
// });