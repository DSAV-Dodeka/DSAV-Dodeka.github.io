import React, { useEffect, useRef, useState } from 'react';
import bg from './background.png';
import avr1 from './Aardvark-run1.png';
import avr2 from './Aardvark-run2.png';
import avr3 from './Aardvark-run3.png';
import avr4 from './Aardvark-run4.png';
import avj from './Aardvark-jump.png';

const Game = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isJumpingRef = useRef(false);
    const [jumpHeight, setJumpHeight] = useState(0);
    const gravity = 1;
    const groundHeight = 50;
    const obstaclesRef = useRef([{ x: 800, width: 20, height: 30 }]);
    const characterRef = useRef({ x: 50, y: 0, width: 120, height: 150 });
    const [difficulty, setDifficulty] = useState(1); // Difficulty level

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let jumpVelocity = -30;
        let frameCounter = 0; // Counter to track animation frames
        let obstacleSpeed = 7; // Initial speed of obstacles
        const minObstacleSpacing = 300; // Minimum distance between obstacles
        const spawnChance = 0.01; // Initial spawn chance

        
        let isJumping = isJumpingRef.current;
        let obstacles = obstaclesRef.current;
        let character = characterRef.current;
        character.y = canvas.height - groundHeight - character.height; 

        const characterImages = [avr1, avr2, avr3, avr4].map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });

        const jumpImage = new Image();
        jumpImage.src = avj;
        
        const bgImage = new Image();
        bgImage.src = bg;
        bgImage.onload = () => {
            animationFrameId = requestAnimationFrame(update);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isJumping) {
                jumpVelocity = -20;
                isJumping = true;
                 // Jump velocity
            }
        };

        const resetGame = () => {
            obstacles = [{ x: 800, width: 20, height: 30 }]; // Reset obstacles
            character.y = canvas.height - groundHeight - character.height; // Reset character position
            isJumping = false; // Reset jumping state
            jumpVelocity = 0; // Reset jump velocity
            setDifficulty(1); // Reset difficulty
            obstacleSpeed = 7; // Reset obstacle speed
        };

        const update = () => {
           // Clear canvas
           ctx.clearRect(0, 0, canvas.width, canvas.height);

           // Draw background image
           ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

            // Update character position
            if (isJumping) {
                jumpVelocity += gravity;
                character.y =  character.y + jumpVelocity;
                if (character.y >= canvas.height - groundHeight - character.height) {
                    character.y = canvas.height - groundHeight - character.height;
                    isJumping = false;
                    jumpVelocity = -15;
                }
            }

            // Cycle through character images
            let currentImage = characterImages[Math.floor(frameCounter / 10) % characterImages.length];
            frameCounter++;

            if (isJumping) {
                currentImage = jumpImage;
            }

            // Draw character
            ctx.drawImage(currentImage, character.x, character.y, character.width, character.height);

             // Update obstacles
             obstacles = obstacles
             .map((obstacle) => ({
                 ...obstacle,
                 x: obstacle.x - obstacleSpeed, // Move obstacles to the left
             }))
             .filter((obstacle) => obstacle.x + obstacle.width > 0); // Remove off-screen obstacles


            // Draw obstacles
            obstacles.forEach((obstacle) => {
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(obstacle.x, canvas.height - groundHeight - obstacle.height, obstacle.width, obstacle.height);

                // Collision detection
                if (
                    character.x < obstacle.x + obstacle.width &&
                    character.x + character.width > obstacle.x &&
                    character.y < canvas.height - groundHeight &&
                    character.y + character.height > canvas.height - groundHeight - obstacle.height
                ) {
                    cancelAnimationFrame(animationFrameId);
                    alert('Game Over!');
                    resetGame();
                }
            });

            // Spawn new obstacles
            let lastObstacle = obstacles[obstacles.length - 1];
            if (
                Math.random() < spawnChance &&
                (!lastObstacle || lastObstacle.x < canvas.width - minObstacleSpacing)
            ) {
                obstacles.push({
                    x: canvas.width,
                    width: 20 + Math.random() * 30,
                    height: 20 + Math.random() * 30,
                });
            }

            // Gradually increase difficulty
            if (frameCounter % 500 === 0) {
                // setDifficulty((prev) => prev + 1);
                obstacleSpeed += 0.5; // Increase obstacle speed
                console.log("difficulty increased to: ", difficulty);
            }

            animationFrameId = requestAnimationFrame(update);
        };

        // Add event listener for jump
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
        };
    });

    return (
        <div>
            <h1>Game Page</h1>
            <p>Press Space to Jump!</p>
            <canvas
                ref={canvasRef}
                width={800}
                height={400}
                style={{ border: '1px solid black', display: 'block', margin: '0 auto' }}
            ></canvas>
        </div>
    );
};

export default Game;