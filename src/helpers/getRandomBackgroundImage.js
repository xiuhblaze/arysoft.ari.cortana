const getRandomBackgroundImage = async () => {
    const backgroundImages = [
        'bgminimal01.jpg',
        'bgminimal02.jpg',
        'bgminimal03.jpg',
        'bgminimal04.jpg',
        'bgminimal05.jpg',
        'bgminimal06.jpg',
        'bgminimal07.jpg',
        'bgminimal08.jpg',
    ];

    try {
        const module = await import(`../assets/img/${backgroundImages[Math.floor(Math.random() * backgroundImages.length)]}`);
        return module.default;
    } catch (error) {
        console.error('getRandomBackgroundImage', error);
        return null;
    }
};

export default getRandomBackgroundImage;