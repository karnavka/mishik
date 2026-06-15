export const CancelIcon = () => {
    return (<img
            src='/images/cancel.png'
            style={{width: '35px', height: '35px', padding: '4px 0px 0px 2px'}}/>
    );
};

type Props = {
    label: string;
    id?: number;
    imgsrc?: string;
};

const img_animal = {2: 'Cat', 1: 'Dog', 3: 'Rabbit', 4: 'Parrot'};

export const BadgeWithIcon = ({label, id=0, imgsrc}: Props) => {
    const hasIcon = id < 5 && id > 0

    const source = hasIcon
        ? `/images/${img_animal[id]}.png`
        : imgsrc;

    return (
        <span style={{
            fontSize: '20px',
            color: 'var(--text-sub)',
            display: 'flex',
            gap: '6px',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '4px 15px',
            border: '1px solid var(--badge-border)',
            borderRadius: '20px',
            background: 'transparent',
        }}>
            {(hasIcon||imgsrc) && (
                <img
                    src={source}
                    style={{width: '32px', height: '32px', objectFit: 'contain'}}
                    alt={label}
                />
            )}
            {label}
        </span>
    );
};