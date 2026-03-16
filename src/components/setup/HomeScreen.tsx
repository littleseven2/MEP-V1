import { Plus, Copy, Clock, ArrowRight } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-secondary)',
  borderRadius: 16,
  border: '1px solid var(--color-border-default)',
  boxShadow: 'var(--shadow-card)',
  padding: 24,
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

export function HomeScreen() {
  const setView = useMessageStore((s) => s.setView);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(229,77,77,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Dot grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-border-default) 1px, transparent 0)`,
          backgroundSize: 24,
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 48,
        }}
      >
        {/* Logo */}
        <img
          src="/n-symbol.png"
          alt="N"
          style={{ width: 40, height: 72, objectFit: 'contain', display: 'block', marginBottom: 16 }}
        />
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            textTransform: 'none',
            letterSpacing: 2,
            color: 'var(--color-text-secondary)',
            marginBottom: 8,
          }}
        >
          Message Enablement Platform
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.25rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 12,
          }}
        >
          Message Construction
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: 16,
            color: 'var(--color-text-secondary)',
            maxWidth: 480,
            textAlign: 'center',
            marginBottom: 48,
          }}
        >
          Build and customize email, push, and in-app messages with our visual builder.
        </p>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            maxWidth: 720,
          }}
        >
          {/* New Message - active */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setView('setup')}
            onKeyDown={(e) => e.key === 'Enter' && setView('setup')}
            style={{
              ...cardStyle,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-deep)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-card)';
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'var(--color-brand-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Plus size={20} color="var(--color-brand)" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 4,
              }}
            >
              New Message
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 14,
                color: 'var(--color-text-secondary)',
              }}
            >
              Create a new message from scratch
            </p>
          </div>

          {/* Duplicate - disabled */}
          <div
            style={{
              ...cardStyle,
              opacity: 0.35,
              cursor: 'not-allowed',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'var(--color-bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Copy size={20} color="var(--color-text-secondary)" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 4,
              }}
            >
              Duplicate
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 14,
                color: 'var(--color-text-secondary)',
              }}
            >
              Duplicate an existing message
            </p>
          </div>

          {/* Previous Version - disabled */}
          <div
            style={{
              ...cardStyle,
              opacity: 0.35,
              cursor: 'not-allowed',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'var(--color-bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Clock size={20} color="var(--color-text-secondary)" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 4,
              }}
            >
              Previous Version
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 14,
                color: 'var(--color-text-secondary)',
              }}
            >
              Restore from a previous version
            </p>
          </div>
        </div>

        {/* Get started link */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setView('setup');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 48,
            fontFamily: 'var(--font-family)',
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--color-brand)',
            textDecoration: 'none',
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.gap = '12px';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.gap = '8px';
          }}
        >
          Get started
          <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
}
