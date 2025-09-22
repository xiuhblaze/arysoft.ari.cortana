class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error capturado:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div>Algo salió mal: {this.state.error?.message}</div>;
        }
        return this.props.children;
    }
}