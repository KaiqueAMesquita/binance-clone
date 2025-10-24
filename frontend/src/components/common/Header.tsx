interface HeaderProps{
    pageName?: string;
    siteName: string;
}

const Header: React.FC<HeaderProps> = ({siteName="Trade Holding AMS", pageName}) => {
    return (
        <div className="header">
        <div className="text-light text-lg font-bold">{siteName}</div>
        <div className="text-accent text-2xl font-medium">{pageName}</div>
            <div className="flex items-center gap-4">
                <button className="btn">Botao 1</button>
                <button className="btn">botao 2</button>
            </div>
        </div>
      )
}

export default Header;