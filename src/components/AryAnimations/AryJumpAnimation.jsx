import { useEffect, useRef, useState } from "react";

const AryJumpAnimation = ({ 
    children,
    className,
    jumpHeight = 12,
    duration = 600,
    interval = 5000,
    easing = 'ease-out',
    autoStart = true,
    ...props }) => {

    const [animate, setAnimate] = useState(false);
    const [isRunning, setIsRunning] = useState(autoStart);
    const intervalRef = useRef();

    const startAnimation = () => {
        setAnimate(false);
        setTimeout(() => {
            setAnimate(true);
        }, 50);
    };

    useEffect(() => {
        
        if (isRunning) {

            // animacion inicial
            if (autoStart) { startAnimation(); }

            // configurar intervalo
            intervalRef.current = setInterval(() => {
                startAnimation();
            }, interval);
        } else {
            clearInterval(intervalRef.current);
        }
        
        return () => clearInterval(intervalRef.current);
    }, [isRunning, interval]);

    // Funcion para controlar manualmente la animación

    const triggerAnimation = () => {
        startAnimation();
    }; // triggerAnimation

    const toggleAutoAnimation = () => {
        setIsRunning(!isRunning);
    }; // toggleAnimation
    
    return (
        <>
            <style>{`
                @keyframes jump-${jumpHeight}-${duration} {
                    0% { transform: translateY(0); }
                    30% { transform: translateY(-${jumpHeight}px); }
                    50% { transform: translateY(-${jumpHeight * 0.6}px); }
                    70% { transform: translateY(-${jumpHeight * 0.3}px); }
                    100% { transform: translateY(0); }
                }
            `}</style>
            <span 
                {...props}
                className={`${className ?? ''} animated-icon`}
                style={{
                    display: 'inline-block',
                    animation: animate ? `jump-${jumpHeight}-${duration} ${easing} ${duration}ms` : 'none',
                    ...props.style,
                }}
                onClick={triggerAnimation}
                onDoubleClick={toggleAutoAnimation}
                // title={isRunning ? 'Doble click para pausar' : 'Doble click para reanudar'}
            >
                { children }
            </span>
        </>
    )
}

export default AryJumpAnimation;