import './Button.scss';

const Button = ({ children, onClick, variant = 'primary', fullWidth = false }) => {
  const classes = [
    'button',
    `button--${variant}`,
    fullWidth && 'button--full-width'
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
