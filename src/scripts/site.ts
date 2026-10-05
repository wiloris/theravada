// Шапка: прозрачная поверх обложки, плотная после прокрутки.
const header = document.querySelector<HTMLElement>('.site-header');
const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Оглавление.
const toc = document.querySelector<HTMLDialogElement>('[data-toc]');
document.querySelectorAll('[data-toc-open]').forEach((b) =>
  b.addEventListener('click', () => {
    toc?.showModal();
    document.documentElement.classList.add('is-locked');
  }),
);
document.querySelectorAll('[data-toc-close]').forEach((b) => b.addEventListener('click', () => toc?.close()));
toc?.addEventListener('close', () => document.documentElement.classList.remove('is-locked'));
toc?.addEventListener('click', (e) => {
  if (e.target === toc) toc.close();
});

// Просмотр изображений.
const box = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
const boxImg = box?.querySelector('img');
const boxCaption = box?.querySelector<HTMLElement>('.lightbox__caption');
document.querySelectorAll<HTMLButtonElement>('[data-lightbox]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    if (!box || !boxImg || !img) return;
    const sources = (img.getAttribute('srcset') ?? '').split(',').map((s) => s.trim().split(' ')[0]);
    boxImg.src = sources.at(-1) || img.currentSrc || img.src;
    boxImg.alt = img.alt;
    const caption =
      img.dataset.caption ??
      btn.closest('figure')?.querySelector('.fig__caption')?.textContent ??
      img.alt;
    if (boxCaption) boxCaption.textContent = caption ?? '';
    box.showModal();
  }),
);
box?.querySelector('[data-lightbox-close]')?.addEventListener('click', () => box.close());
box?.addEventListener('click', (e) => {
  if (e.target === box || e.target === boxImg) box.close();
});

// Мягкое появление блоков при прокрутке.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px' },
  );
  document.querySelectorAll('.reveal').forEach((el) => {
    el.classList.add('reveal--armed');
    io.observe(el);
  });
}
