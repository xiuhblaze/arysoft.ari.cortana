
export const Loading = () => {
  return (
    <div className="text-center">
        <div className="w-100 m-auto" style={{ paddingTop: 'calc(50vh - 50px)', width: '3rem', height: '3rem' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    </div>
  )
}

export default Loading;