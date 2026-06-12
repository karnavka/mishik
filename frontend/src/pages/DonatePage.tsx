import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

type DonateLocationState = {
  from?: string;
  shelterId?: number;
  shelterName?: string;
};

const digitsOnly = (value: string) => value.replace(/\D/g, '');

const formatCardNumber = (value: string) =>
  digitsOnly(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

/*const isValidLuhn = (value: string) => {
  let sum = 0;
  let shouldDouble = false;

  for (let i = value.length - 1; i >= 0; i -= 1) {
    let digit = Number(value[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};*/

const normalizeReturnPath = (value?: string) =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : '/';

export const DonatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DonateLocationState | null;
  const returnTo = normalizeReturnPath(state?.from);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const cardDigits = useMemo(() => digitsOnly(cardNumber), [cardNumber]);
  const isCardComplete = cardDigits.length === 16;
    const isCardValid = isCardComplete;
  const showCardWarning = isCardComplete && !isCardValid;
  const amountNumber = Number(amount);

  const canDonate =
    name.trim().length > 1 &&
    amountNumber > 0 &&
    isCardValid &&
    expiresAt.length === 5 &&
    (cvv.length === 3 || cvv.length === 4);

  const handleCardChange = (value: string) => {
    setCardNumber(formatCardNumber(value));
  };

  const handleExpiryChange = (value: string) => {
    const digits = digitsOnly(value).slice(0, 4);
    setExpiresAt(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canDonate) return;

    setError('');

    if (state?.shelterId) {
      try {
        const res = await fetch('/api/donations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            shelterId: state.shelterId,
            amount: amountNumber,
          }),
        });

        if (!res.ok) {
          throw new Error('Не вдалося зберегти донат. Спробуйте ще раз.');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Помилка донату');
        return;
      }
    }

    navigate('/donate/thanks', { state: { returnTo } });
  };

  return (
    <main className="donate-page">
        <form
            className="donate-form"
            onSubmit={handleSubmit}
            autoComplete="off"
        >
        <div className="donate-head">
          <h1>Донат для притулку</h1>
          <p>Кошти підуть на їжу, лікування та догляд за тваринками.</p>
        </div>

        {state?.shelterName && (
          <section className="donation-requisites">
            <div className="detail-shelter-title">Реквізити отримувача</div>
            <div className="card-field"><span>Притулок</span>{state.shelterName}</div>
          </section>
        )}

        <label className="form-field">
          <span>Ім'я донатора</span>
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Ваше ім'я"
            autoComplete="new-password"
          />
        </label>

        <label className="form-field">
          <span>Сума донату, грн</span>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={event => setAmount(event.target.value)}
            placeholder="Наприклад, 300"
          />
        </label>

        <label className="form-field">
          <span>Номер картки</span>
          <input
            type="text"
            inputMode="numeric"
            value={cardNumber}
            onChange={event => handleCardChange(event.target.value)}
            placeholder="0000 0000 0000 0000"
            autoComplete="new-password"
            aria-invalid={showCardWarning}
          />
        </label>

        {showCardWarning && (
          <div className="donate-warning">
            Неправильно введені дані картки. Перевірте номер картки.
          </div>
        )}

        {error && <div className="donate-warning">{error}</div>}

        <div className="donate-row">
          <label className="form-field">
            <span>Термін дії</span>
            <input
              type="text"
              inputMode="numeric"
              value={expiresAt}
              onChange={event => handleExpiryChange(event.target.value)}
              placeholder="MM/YY"
              autoComplete="new-password"
            />
          </label>

          <label className="form-field">
            <span>CVV</span>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={cvv}
              onChange={event => setCvv(digitsOnly(event.target.value).slice(0, 4))}
              placeholder="123"
              autoComplete="new-password"
            />
          </label>
        </div>

        <div className="donate-actions">
          <button className="btn-primary donate-submit" type="submit" disabled={!canDonate}>
            Задонатити
          </button>
          <button className="btn-ghost" type="button" onClick={() => navigate(returnTo)}>
            Скасувати
          </button>
        </div>
      </form>
    </main>
  );
};
