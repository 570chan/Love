## Hi! I am Yuki Anka Meow

## my project fall
> This is a project of mine, almost entirely taken from taoanhdep.com and customize the rendering system.
### language used 
- The project primarily uses JavaScript (for rendering text and heart.png).

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)
![Canvas API](https://img.shields.io/badge/Canvas_API-4FC3F7?style=for-the-badge)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
### the APIs we use 
![Canvas API](https://img.shields.io/badge/Canvas_API-4FC3F7?style=for-the-badge)
![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)
![DOM API](https://img.shields.io/badge/DOM_API-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Event API](https://img.shields.io/badge/Event_API-FF9800?style=for-the-badge)
![Touch Events](https://img.shields.io/badge/Touch_Events-00ACC1?style=for-the-badge)
![Mouse Events](https://img.shields.io/badge/Mouse_Events-7B1FA2?style=for-the-badge)
![Wheel Events](https://img.shields.io/badge/Wheel_Events-5E35B1?style=for-the-badge)
![Performance API](https://img.shields.io/badge/Performance_API-43A047?style=for-the-badge)
### How do I use it?

- **To use it**, you need to go to the index.htm file and find the following section (right above).
```html
<script>
const texts = ["Yu.meow","Yu.meo","Yu.ely"];
const youtubeId = "VBO4xoFlNhI";
</script>
```
  - Now you need to change "const texts" to the name you want in square brackets, and you can add more names if you like.

- **Adjusting the number of characters**: Find the createFallingTexts() function, change the number 350 in the loop line
  ```javascript
  for (let i = 0; i < 350; i++) { 
  ```
  - The larger the magic number, the more frequently the text appears. I advise you that if you want dense text, the magic number shouldn't exceed 600, If you're going to take a risk, don't exceed 1000 Because that's the limit; if you want to push it up to 2000-5000, you need to use advanced techniques called ``THREE.InstancedMesh`` or the ``THREE.Points`` particle system.

 - **Adjust the falling speed of the heart image**: Find this section just below and change the number to 0.04.
   ```javascript
   mesh.position.y -= 0.04 + Math.random() * 0.02;
    ```

   - The base value is 0.04. If you want the heart rate to slow down to match the speed of the text, adjust it to 0.02. I recommend setting it to 60 if you want a denser image; the limit for this is 300.

[![Website](https://img.shields.io/badge/Website-Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://hanni-love.vercel.app)
![Javascript](https://img.shields.io/badge/Made%20with-Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white)
![HTML](https://img.shields.io/badge/Made%20with-HTML-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
