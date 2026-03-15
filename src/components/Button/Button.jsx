import './Button.scss';

const Button = ({ children, onClick, variant = 'primary', fullWidth = false, type = 'button' }) => {
  const classes = [
    'button',
    `button--${variant}`,
    fullWidth && 'button--full-width'
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;
