let container = `
    <canvas id="game" width="400" height="400" style="border:1px solid #000000;"></canvas>

    
    <script>
        let c = document.getElementById("game");
        let ctx = c.getContext('2d');
        let width = c.width;
        let height = c.height;
        let x = 0;
        let y = 0;

        // Fills tiles with green
        while (y != width) {
            let chance = Math.random();
            if (chance > 0.20) {
                ctx.fillStyle = "#00FF00";
            } else {
                ctx.fillStyle = "#0066FF";
            }
            ctx.fillRect(x, y, 20, 20);
            x += 20;
            if (x == width) {
                y += 20;
                x = 0;
            }
        }

        // Wow i found 2 ways to do this. lol
        // ctx.fillStyle = "#00FF00";
        // ctx.fillRect(0, 0, width, height);
        
        // x y reset
        y = 20;
        x = 20;

        // Draws grid pattern.
        while (y != width) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
            x += 20;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
            y += 20;
        }
    </script>


<br>`;

module.exports = {
    container
}
