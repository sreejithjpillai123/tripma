"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const items = [
    { img: "/images/Hero.png", text: "Explore the World", color: "from-blue-400 to-indigo-500" },
    { img: "/images/Luggage.png", text: "Smart Travel", color: "from-purple-400 to-pink-500" },
    { img: "/images/Map.png", text: "Navigate Easy", color: "from-amber-400 to-orange-500" },
    { img: "/images/Price History.png", text: "Best Deals", color: "from-green-400 to-emerald-500" },
    { img: "/images/img1.png", text: "Luxury Stays", color: "from-rose-400 to-red-500" },
    { img: "/images/success.png", text: "Safe Journey", color: "from-cyan-400 to-sky-500" },
];

export default function DemoPage() {
    const containerRef = useRef(null);

    // Track scroll progress purely relative to this container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Animations based on scroll
    const rotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
    // Expand faster: Reach 500px radius by 80% scroll to keep clear of text
    const expansion = useTransform(scrollYProgress, [0, 0.8], [0, 500]);

    // Transition: Image visible at start, Text visible on scroll
    // Image fades out quickly as we scroll
    const imageOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const imageScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.5]);

    // Text fades in after image is gone
    // Start slightly later (0.2) to ensure boxes have moved out
    const textOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
    const textScale = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]); // Starts at 0 size, grows to 1

    return (
        <div ref={containerRef} className="h-[400vh] bg-[#050505] relative font-sans">

            {/* Sticky container to hold the viewport content */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* Background Gradients for Aesthetics */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
                </div>

                {/* 1. Initial State: Central Circle Image */}
                <motion.div
                    style={{ opacity: imageOpacity, scale: imageScale }}
                    className="absolute z-20 flex flex-col items-center justify-center pointer-events-none"
                >
                    <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-1 mb-6 shadow-[0_0_60px_rgba(59,130,246,0.5)]">
                        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                            {/* Using a placeholder or hero image as the 'Avatar' */}
                            <img src="/images/img1.png" alt="Intro" className="w-full h-full object-cover opacity-90" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-gray-400 text-sm tracking-widest uppercase">Welcome</p>
                        <h2 className="text-white text-xl font-light tracking-[0.2em] uppercase animate-pulse">Scroll Down</h2>
                    </div>
                </motion.div>

                {/* 2. Scroll State: Bio Text */}
                {/* z-10 puts it behind the initial image (z-20) and we'll keep it there. Boxes will be on top. */}
                <motion.div
                    style={{ opacity: textOpacity, scale: textScale }}
                    className="absolute z-10 max-w-xl w-full px-8 text-center pointer-events-none"
                >
                    <p className="text-lg md:text-2xl text-gray-200 leading-relaxed font-light drop-shadow-2xl">
                        My name is <span className="font-semibold text-white">Sreejith J Pillai</span>, and I am a 2025 B.Tech graduate, completed training at <span className="text-orange-400">QSpiders</span> as a Full Stack Developer with a focus on <span className="text-blue-400">Python</span> and <span className="text-cyan-400">React</span> and also currently working as an intern in <span className="text-white font-bold">Woxro</span>.
                    </p>
                </motion.div>

                {/* Animation Group */}
                <motion.div
                    style={{ rotate: rotation }}
                    className="relative flex items-center justify-center w-full h-full"
                >
                    {items.map((item, index) => {
                        const step = 360 / items.length;
                        const angleDeg = index * step;

                        return (
                            <FloatingItem
                                key={index}
                                item={item}
                                angleDeg={angleDeg}
                                radius={expansion}
                                containerRotation={rotation}
                            />
                        );
                    })}
                </motion.div>
            </div>

            {/* Scroll padding at the bottom */}
            <div className="h-screen flex items-center justify-center relative z-10 transition-colors">
                {/* <div className="text-center">
                    <h2 className="text-4xl text-white font-bold mb-4">Contact Me</h2>
                    <p className="text-gray-400">sreejith@example.com</p>
                </div> */}
            </div>

        </div>
    );
}

// Sub-component for individual items
function FloatingItem({ item, angleDeg, radius, containerRotation }) {
    // Convert angle to correct radians for positioning
    const angleRad = (angleDeg * Math.PI) / 180;

    // Calculate X and Y based on the dynamic radius
    const x = useTransform(radius, (r) => r * Math.cos(angleRad));
    const y = useTransform(radius, (r) => r * Math.sin(angleRad));

    // Counter-rotate the item so it stays upright relative to the screen
    const counterRotate = useTransform(containerRotation, (r) => -r);

    // Horizontal Spin: Rotate around Y axis rapidly
    const rotateY = useTransform(containerRotation, (r) => r * 5);

    // Fade in text and scale up box as it moves out
    const itemOpacity = useTransform(radius, [50, 150], [0, 1]);
    const scale = useTransform(radius, [0, 100], [0.5, 1]);

    return (
        <motion.div
            style={{ x, y, rotate: counterRotate, rotateY, scale }}
            className={`absolute w-40 h-48 rounded-2xl z-20 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center justify-start p-4 overflow-hidden group hover:border-white/30 transition-colors duration-300`}
        >
            {/* Glow effect */}
            <div className={`absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br ${item.color} blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity`} />

            <div className="relative z-10 w-full flex flex-col items-center h-full">
                {/* Image Container */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 mb-4 shadow-lg flex-shrink-0 bg-neutral-800">
                    <img src={item.img} alt={item.text} className="w-full h-full object-cover" />
                </div>

                {/* Text Content - Reveals Smoothly */}
                <motion.div
                    style={{ opacity: itemOpacity }}
                    className="text-center"
                >
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{item.text}</h3>
                    <p className="text-xs text-gray-400">Discover more details</p>

                    {/* Tiny decorative line */}
                    <div className={`mt-3 h-1 w-8 rounded-full bg-gradient-to-r ${item.color} mx-auto`} />
                </motion.div>
            </div>
        </motion.div>
    );
}
