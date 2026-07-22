# ❤️ Love

A lightweight interactive webpage featuring animated falling texts, floating hearts, and background music rendered with **Three.js** and **WebGL**.

> This project is heavily inspired by **taoanhdep.com**, with custom rendering logic, animation adjustments, and personalized effects.

---

## ✨ Features

- Falling custom text animation
- Animated heart particles
- Background music support
- WebGL accelerated rendering
- Lightweight and easy to customize
- Mobile & desktop compatible

---

## 🛠 Tech Stack

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)
![Plyr](https://img.shields.io/badge/Plyr-00B3FF?style=for-the-badge&logo=plyr&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## APIs Used

![Canvas API](https://img.shields.io/badge/Canvas_API-4FC3F7?style=for-the-badge)
![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)
![DOM API](https://img.shields.io/badge/DOM_API-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Event API](https://img.shields.io/badge/Event_API-FF9800?style=for-the-badge)
![Touch Events](https://img.shields.io/badge/Touch_Events-00ACC1?style=for-the-badge)
![Mouse Events](https://img.shields.io/badge/Mouse_Events-7B1FA2?style=for-the-badge)
![Wheel Events](https://img.shields.io/badge/Wheel_Events-5E35B1?style=for-the-badge)
![Performance API](https://img.shields.io/badge/Performance_API-43A047?style=for-the-badge)

---

## Deployment

The project can be deployed on any static hosting service.

Example:

- Vercel
- Netlify
- GitHub Pages

---

# Customization

## Change the displayed names

Open **index.html** and locate:

```html
<script>
const texts = ["Yu.meow","Yu.meo","Yu.ely"];
const youtubeId = "VBO4xoFlNhI";
</script>
```

Replace the `texts` array with your own names.

Example:

```javascript
const texts = [
    "Alice",
    "Bob",
    "Charlie"
];
```

You may add as many entries as you like.

---

## Change text density

Inside **script.js**, find:

```javascript
for (let i = 0; i < 350; i++) {
```

Increase or decrease the value.

Suggested values:

| Value | Result |
|-------:|--------|
|150|Sparse|
|350|Default|
|600|Dense|
|1000|Maximum recommended|

> **Note**
>
> Values above **1000** are not recommended.
> If you need several thousand particles, consider using:
>
> - `THREE.InstancedMesh`
> - `THREE.Points`

---

## Adjust heart falling speed

Locate:

```javascript
mesh.position.y -= 0.04 + Math.random() * 0.02;
```

Examples:

```javascript
0.02
```

Slower animation.

```javascript
0.04
```

Default.

```javascript
0.06
```

Faster animation.

---

## Change the music

Replace the YouTube video ID.

```javascript
const youtubeId = "VBO4xoFlNhI";
```

Example:

```javascript
const youtubeId = "YOUR_VIDEO_ID";
```

---

# Project Structure

```
Love/
│
├── index.html
├── script.js
├── LICENSE
├── README.md
│
└── src/
    ├── heart.png
    ├── meow.png
    └── Uhh.md
```

---

# Performance Notes

- Recommended particle count: **300–600**
- Maximum recommended: **1000**
- For larger particle counts, use GPU instancing (`THREE.InstancedMesh`) or point rendering (`THREE.Points`) to maintain smooth performance.

---

# Notes

- This project is intended for **learning and personal customization**.
- The original visual concept is inspired by **taoanhdep.com**.
- Feel free to modify the animation, text, colors, and assets to suit your own style.
- Please respect the original inspiration when redistributing modified versions.

---

# License

See the **LICENSE** file included in this repository.

---

Made with ❤️ by **Yuki Anka**
