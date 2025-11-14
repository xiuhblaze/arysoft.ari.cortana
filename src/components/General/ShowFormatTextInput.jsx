import isNullOrEmpty from "../../helpers/isNullOrEmpty";

const ShowFormatTextInput = (value, separator = '\n') => {
    if (value == null) return null;

    return String(value).split(separator).map((item, index) => {
        return (
            <div key={index} className="text-wrap">
                {isNullOrEmpty(item) ? '\u00A0' : item} {/*  \u00A0 is &nbsp; para generar un salto de linea */}
            </div>
        )            
    });
} // ShowFormatTextInput

export default ShowFormatTextInput;