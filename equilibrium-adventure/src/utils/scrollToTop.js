/**
 * Utilitário para rolar a página para o topo
 */
export const scrollToTop = () => {
    window.scrollTo(0, 0);
};

/**
 * Utilitário para rolar a página para o topo com animação suave
 */
export const scrollToTopSmooth = () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
};

/**
 * Hook customizado para rolar para o topo quando o componente é montado
 * @param {boolean} smooth - Se deve usar animação suave (padrão: false)
 */
export const useScrollToTop = (smooth = false) => {
    if (smooth) {
        scrollToTopSmooth();
    } else {
        scrollToTop();
    }
};