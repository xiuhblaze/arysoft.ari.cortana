export const renameFile = (file, newName) => {
    const ext = file.name.split('.').pop();
    const fullNewName = `${newName}.${ext}`;

    return new File([file], fullNewName, { 
        type: file.type,
        lastModified: file.lastModified,
    });
};

export default renameFile;