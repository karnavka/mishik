import { useLocation, useNavigate } from 'react-router-dom';

type DonateThanksLocationState = {
  returnTo?: string;
};

const normalizeReturnPath = (value?: string) =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : '/';

export const DonateThanksPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DonateThanksLocationState | null;
  const returnTo = normalizeReturnPath(state?.returnTo);

  return (
    <main className="thanks-page">
      <section className="thanks-panel">
        <h1>Дякуємо за донат!</h1>
        <button className="btn-primary" type="button" onClick={() => navigate(returnTo)}>
          Повернутися
        </button>
      </section>
    </main>
  );
};
