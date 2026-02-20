function Card({ className = '', children }) {
  return (
    <div className={`app-card rounded-2xl border border-white/10 bg-white/5 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

export default Card;

