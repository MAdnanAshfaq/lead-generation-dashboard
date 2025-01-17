export const varFade = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.32,
            ease: [0.43, 0.13, 0.23, 0.96],
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.24,
            ease: [0.43, 0.13, 0.23, 0.96],
        },
    },
};

export const varFadeIn = {
    ...varFade,
};

export const varFadeInUp = {
    ...varFade,
    initial: {
        ...varFade.initial,
        translateY: 24,
    },
    animate: {
        ...varFade.animate,
        translateY: 0,
    },
    exit: {
        ...varFade.exit,
        translateY: 24,
    },
};

export const varFadeInDown = {
    ...varFade,
    initial: {
        ...varFade.initial,
        translateY: -24,
    },
    animate: {
        ...varFade.animate,
        translateY: 0,
    },
    exit: {
        ...varFade.exit,
        translateY: -24,
    },
};

export const varFadeInLeft = {
    ...varFade,
    initial: {
        ...varFade.initial,
        translateX: -24,
    },
    animate: {
        ...varFade.animate,
        translateX: 0,
    },
    exit: {
        ...varFade.exit,
        translateX: -24,
    },
};

export const varFadeInRight = {
    ...varFade,
    initial: {
        ...varFade.initial,
        translateX: 24,
    },
    animate: {
        ...varFade.animate,
        translateX: 0,
    },
    exit: {
        ...varFade.exit,
        translateX: 24,
    },
};
