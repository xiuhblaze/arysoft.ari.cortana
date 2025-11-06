import isNullOrEmpty from "../../helpers/isNullOrEmpty";

const ShowFormatTextInput = (value, separator = '\n') => {
    
    return value != null 
        ? value.split(separator).map((item, index) => {
            return (
                <div key={index} className="text-wrap">
                    {isNullOrEmpty(item) ? '\u00A0' : item}
                </div>
            )            
        })
        : null
} // ShowFormatTextInput

export default ShowFormatTextInput;