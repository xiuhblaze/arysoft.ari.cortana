import ContentLoader from "react-content-loader"

const AppFormPreviewStandardLoading = (props) => (
    <ContentLoader
        speed={2}
        width={400}
        height={104}
        viewBox="0 0 400 104"
        backgroundColor="#f8f9fa"
        foregroundColor="#e9ecef"
        {...props}
    >
        <rect x="2" y="2" rx="3" ry="3" width="140" height="30" />
        <rect x="152" y="9" rx="3" ry="3" width="173" height="15" />

        <rect x="2" y="37" rx="3" ry="3" width="140" height="30" />
        <rect x="152" y="44" rx="3" ry="3" width="134" height="15" />

        <rect x="2" y="72" rx="3" ry="3" width="140" height="30" />
        <rect x="152" y="79" rx="3" ry="3" width="235" height="15" />
    </ContentLoader>
)

export default AppFormPreviewStandardLoading

