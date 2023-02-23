import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { registration } from '../../action/user';
import { registration } from '../../reducers/userSlice';
import Input from '../../utils/input/Input';
import './authorization.less';

const Registration = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="authorization">
      <div className="authorization__header">Регистрация</div>
      <Input
        value={email}
        setValue={setEmail}
        type="text"
        placeholder="Введите email"
      />
      <Input
        value={password}
        setValue={setPassword}
        type="password"
        placeholder="Введите пароль"
      />
      <button
        className="authorization__btn"
        onClick={() => dispatch(registration({ email, password }))}
      >
        Зарегистрироваться
      </button>
    </div>
  );
};

export default Registration;
