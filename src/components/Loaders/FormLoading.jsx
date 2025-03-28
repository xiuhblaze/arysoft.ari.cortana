import ContentLoader from "react-content-loader"

/**
 * Componente de carga para formularios, obtenido de https://github.com/danilowoz/react-content-loader
 * Para generar el esqueleto, se puede usar https://skeletonreact.com/
 * @param {propiedades extendidas de react-content-loader} props 
 * @returns {React.ReactElement}
 */
const FormLoading = ({...props}) => {
    return (
        <ContentLoader
            speed={2}
            width={500}
            height={168}
            viewBox="0 0 500 168"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            {...props}
        >
            <rect x="0" y="0" rx="6" ry="6" width="220" height="20" />
            <rect x="0" y="28" rx="6" ry="6" width="500" height="40" />
            <rect x="0" y="84" rx="6" ry="6" width="180" height="20" />
            <rect x="0" y="112" rx="6" ry="6" width="500" height="40" />
        </ContentLoader>
    )
}

export default FormLoading