import envVariables from "../../helpers/envVariables";

const ComponentLoading = ({ variant, size = "md", boxSize = "md", ...props }) => {
    let width = '2rem';
    let height = '2rem';
    let boxWidth = '2rem';
    let boxHeight = '2rem';

    const { VITE_DEFAULT_VARIANT } = envVariables();

    // Size 
    if (size == "xs") {
        width = '0.5rem';
        height = '0.5rem';
    }

    if (size == "sm") {
        width = '1rem';
        height = '1rem';
    }
    
    if (size == "lg") {
        width = '3rem';
        height = '3rem';
    }

    if (size == "xl") {
        width = '5rem';
        height = '5rem';
    }
    
    if (size == "xxl") {
        width = '5rem';
        height = '5rem';
    }

    // Box size
    if (boxSize == "xs") {        
        boxWidth = '0.5rem';
        boxHeight = '0.5rem';
    }

    if (boxSize == "sm") {
        boxWidth = '1rem';
        boxHeight = '1rem';
    }

    if (boxSize == "lg") {
        boxWidth = '3rem';
        boxHeight = '3rem';
    }

    if (boxSize == "xxl") {
        boxWidth = '7rem';
        boxHeight = '7rem';
    }

    if (boxSize == "xxl") {
        boxWidth = '7rem';
        boxHeight = '7rem';
    }

    return (
        <div {...props} className="text-center">
            <div className="w-100 m-auto" style={{ paddingTop: boxWidth, paddingBottom: boxHeight }}>
                <div 
                    className={`spinner-border text-${variant ?? VITE_DEFAULT_VARIANT}`} 
                    role="status" 
                    style={{ width: width, height: height }}
                >
                    <span className="visually-hidden">Loading...</span>
                </div>                
            </div>
        </div>
    )
}

export default ComponentLoading