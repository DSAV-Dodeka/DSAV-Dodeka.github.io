import React, { useEffect, useRef, useState } from 'react';

const Game = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isJumpingRef = useRef(false);
    const [jumpHeight, setJumpHeight] = useState(0);
    const gravity = 1;
    const groundHeight = 20;
    const obstaclesRef = useRef([{ x: 800, width: 20, height: 30 }]);
    const characterRef = useRef({ x: 50, y: 0, width: 30, height: 30 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let jumpVelocity = -10;
        
        let isJumping = isJumpingRef.current;
        let obstacles = obstaclesRef.current;
        let character = characterRef.current;
        character.y = canvas.height - groundHeight - 30;
        console.log(obstacles);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isJumping) {
                console.log('Jump!');
                jumpVelocity = -15;
                isJumping = true;
                 // Jump velocity
            }
        };

        const resetGame = () => {
            obstacles = [{ x: 800, width: 20, height: 30 }]; // Reset obstacles
            character.y = canvas.height - groundHeight - character.height; // Reset character position
            isJumping = false; // Reset jumping state
            jumpVelocity = 0; // Reset jump velocity
            // cancelAnimationFrame(animationFrameId); // Stop the game loop
            // animationFrameId = requestAnimationFrame(update); // Restart the game loop
        };

        const update = () => {
            // Clear canvas
            ctx.fillStyle = '#f4f4f4';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw ground
            ctx.fillStyle = '#555';
            ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

            // Update character position
            if (isJumping) {
                jumpVelocity += gravity;
                character.y =  character.y + jumpVelocity;
                console.log(isJumping)
                console.log(character.y, canvas.height - groundHeight - character.height, jumpVelocity);
                if (character.y >= canvas.height - groundHeight - character.height) {
                    character.y = canvas.height - groundHeight - character.height;
                    isJumping = false;
                    jumpVelocity = -15;
                }
            }

            // Draw character
            ctx.fillStyle = '#000';
            ctx.fillRect(character.x, character.y, character.width, character.height);

             // Update obstacles
             obstacles = obstacles
             .map((obstacle) => ({
                 ...obstacle,
                 x: obstacle.x - 5, // Move obstacles to the left
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
            if (Math.random() < 0.01) {
                obstacles.push({
                    x: canvas.width,
                    width: 20 + Math.random() * 30,
                    height: 20 + Math.random() * 30,
                });
            }

            animationFrameId = requestAnimationFrame(update);
        };

        // Start game loop
        animationFrameId = requestAnimationFrame(update);

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