import React, { useEffect, useRef, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import bg from './background.png';
import avr1 from './Aardvark-run1.png';
import avr2 from './Aardvark-run2.png';
import avr3 from './Aardvark-run3.png';
import avr4 from './Aardvark-run4.png';
import avj from './Aardvark-jump.png';
import hh from './Horde-hoog.png';
import hl from './Horde-laag.png';
import hs from './Steeple.png';
import './Game.scss'; 

const Game = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isJumpingRef = useRef(false);
    const [jumpHeight, setJumpHeight] = useState(0);
    const gravity = 1;
    const groundHeight = 50;
    const obstaclesRef = useRef([{ x: 800, width: 20, height: 30, src: 0}]);
    const characterRef = useRef({ x: 50, y: 0, width: 120, height: 150 });
    const [difficulty, setDifficulty] = useState(1); // Difficulty level
    const [isGameOver, setIsGameOver] = useState(false); // Game over state
    const [isGameStarted, setIsGameStarted] = useState(false); // Game start state
    const scoreRef = useRef(0); // Score state stored in a ref

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let jumpVelocity = -30;
        let frameCounter = 0; // Counter to track animation frames
        let obstacleSpeed = 7; // Initial speed of obstacles
        let spawnChance = 0.01; // Chance to spawn an obstacle
        const minObstacleSpacing = 350; // Minimum distance between obstacles

        let isJumping = isJumpingRef.current;
        let obstacles = obstaclesRef.current;
        let character = characterRef.current;
        character.y = canvas.height - groundHeight - character.height; 

        const characterImages = [avr1, avr2, avr3, avr4].map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });

        const hordeImages = [hh, hl, hs].map((src) => {
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
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !isJumping) {
                e.preventDefault();
                if (!isGameStarted) {
                    setIsGameStarted(true);
                } else if (isGameOver) {
                    resetGame();
                    setIsGameOver(false);
                } else {
                    jumpVelocity = -20;
                    isJumping = true;
                }
            }
        };

        const resetGame = () => {
            obstacles = [{ x: 800, width: 20, height: 30 , src: 0}]; // Reset obstacles
            character.y = canvas.height - groundHeight - character.height; // Reset character position
            isJumping = false; // Reset jumping state
            jumpVelocity = 0; // Reset jump velocity
            setDifficulty(1); // Reset difficulty
            obstacleSpeed = 7; // Reset obstacle speed
            spawnChance = 0.02; // Initial spawn chance
            frameCounter = 0; // Reset frame counter
            scoreRef.current = 0; // Reset score
        };

        const drawGameOverScreen = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#fff';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2);
            ctx.fillText('Begin opnieuw met spatie', canvas.width / 2, canvas.height / 2 + 40);
        };

        const drawStartScreen = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#fff';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Welkom bij Arnolds minigame!', canvas.width / 2, canvas.height / 2 - 40);
            ctx.font = '20px Arial';
            ctx.fillText('Druk op spatie om te beginnen', canvas.width / 2, canvas.height / 2);
        };

        const update = () => {
            if (!isGameStarted) {
                drawStartScreen();
                return;
            }

            if (isGameOver) {
                drawGameOverScreen();
                return;
            }

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background image
            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

            // Update character position
            if (isJumping) {
                jumpVelocity += gravity;
                character.y = character.y + jumpVelocity;
                if (character.y >= canvas.height - groundHeight - character.height) {
                    character.y = canvas.height - groundHeight - character.height;
                    isJumping = false;
                    jumpVelocity = -15;
                }
            }

            // Cycle through character images
            let currentImage = characterImages[Math.floor(frameCounter / 10) % characterImages.length];
            frameCounter++;
            scoreRef.current = frameCounter; // Update score

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
                ctx.drawImage(hordeImages[obstacle.src], obstacle.x, canvas.height - groundHeight - obstacle.height, obstacle.width, obstacle.height);
                
                // Collision detection
                if (
                    character.x + 40 < obstacle.x + obstacle.width &&
                    character.x + character.width - 40 > obstacle.x &&
                    character.y < canvas.height - groundHeight &&
                    character.y + character.height + 3 > canvas.height - groundHeight - obstacle.height
                ) {
                    cancelAnimationFrame(animationFrameId);
                    setIsGameOver(true);
                }
            });

            // Spawn new obstacles
            let lastObstacle = obstacles[obstacles.length - 1];
            if (
                Math.random() < spawnChance &&
                (!lastObstacle || lastObstacle.x < canvas.width - minObstacleSpacing)
            ) {
                let rn = Math.random();
                if (rn <= 0.33) {
                    obstacles.push({
                        x: canvas.width,
                        width: 30,
                        height: 60,
                        src: 0, // High obstacle
                    });
                } else if (rn < 0.66) {
                    obstacles.push({
                        x: canvas.width,
                        width: 30,
                        height: 30,
                        src: 1, // Low obstacle
                    });
                } else {
                    obstacles.push({
                        x: canvas.width,
                        width: 30,
                        height: 90,
                        src: 2, // Steeple obstacle
                    });
                }
                // obstacles.push({
                //     x: canvas.width,
                //     width: 20 + Math.random() * 30,
                //     height: 20 + Math.random() * 30,
                // });
            }

            // Gradually increase difficulty
            if (frameCounter % 500 === 0) {
                obstacleSpeed += 0.5; // Increase obstacle speed
                spawnChance += 0.01; // Increase spawn chance
            }

            // Draw score
            ctx.fillStyle = '#000';
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${scoreRef.current}`, canvas.width - 120, 30);

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
        <div className='game-container'>
            <PageTitle title="Arnolds minigame" />
            <canvas
                className="game-canvas"
                ref={canvasRef}
                width={800}
                height={400}
                style={{ display: 'block', margin: '0 auto' }}
            ></canvas>
        </div>
    );
};

export default Game;