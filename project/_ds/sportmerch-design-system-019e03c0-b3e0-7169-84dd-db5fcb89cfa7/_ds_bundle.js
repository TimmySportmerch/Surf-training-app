/* @ds-bundle: {"format":3,"namespace":"SportmerchDesignSystem_019e03","components":[],"sourceHashes":{"ui_kits/website/Cart.jsx":"3620bfb69dc2","ui_kits/website/ClubSurfaces.jsx":"829e1d0e4c98","ui_kits/website/Footer.jsx":"0dfd32d70f0d","ui_kits/website/Header.jsx":"42fec175e2e7","ui_kits/website/Hero.jsx":"929e4868784e","ui_kits/website/Sections.jsx":"66e8e90ecee3","ui_kits/website/Shop.jsx":"a9e33fb86287"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SportmerchDesignSystem_019e03 = window.SportmerchDesignSystem_019e03 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/website/Cart.jsx
try { (() => {
/* global React */
function CartDrawer({
  open,
  items,
  onClose,
  onCheckout,
  onRemove
}) {
  const total = items.reduce((acc, i) => acc + parseFloat(i.price.replace('€', '').replace(',', '.')), 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: 'sm-scrim' + (open ? ' is-open' : ''),
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: 'sm-cart' + (open ? ' is-open' : ''),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("header", {
    className: "sm-cart__head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Mein Warenkorb"), /*#__PURE__*/React.createElement("h3", {
    className: "sm-cart__title"
  }, items.length, " Artikel")), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: onClose,
    "aria-label": "Schlie\xDFen"
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "sm-cart__body"
  }, items.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "sm-cart__empty"
  }, /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Noch leer."), /*#__PURE__*/React.createElement("p", {
    className: "caption"
  }, "W\xE4hl einen Local Hero und f\xFCll die Vereinskasse.")), items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "sm-cart-line",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-cart-line__img",
    style: {
      background: it.bg
    }
  }, /*#__PURE__*/React.createElement("span", null, it.player.num)), /*#__PURE__*/React.createElement("div", {
    className: "sm-cart-line__meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-cart-line__title"
  }, it.t, " \xB7 ", it.player.name.split(' ').slice(-1)[0]), /*#__PURE__*/React.createElement("div", {
    className: "sm-cart-line__sub"
  }, "Gr\xF6\xDFe ", it.size, it.custom ? ' · personalisiert' : ''), /*#__PURE__*/React.createElement("div", {
    className: "sm-cart-line__price"
  }, it.price)), /*#__PURE__*/React.createElement("button", {
    className: "text-link",
    onClick: () => onRemove(i)
  }, "entfernen")))), /*#__PURE__*/React.createElement("footer", {
    className: "sm-cart__foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-cart__totals"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Zwischensumme"), /*#__PURE__*/React.createElement("strong", null, "\u20AC ", total.toFixed(2).replace('.', ','))), /*#__PURE__*/React.createElement("div", {
    className: "sm-cart__give"
  }, /*#__PURE__*/React.createElement("span", null, "Davon an den Verein"), /*#__PURE__*/React.createElement("strong", null, "\u20AC ", (total * 0.25).toFixed(2).replace('.', ',')))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-lg btn-block",
    disabled: items.length === 0,
    onClick: onCheckout
  }, "Zur Kasse"))));
}
window.SMCartDrawer = CartDrawer;
function CheckoutSuccess({
  onHome
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "sm-section sm-section--success"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container sm-success"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow eyebrow--light"
  }, "Bestellung best\xE4tigt"), /*#__PURE__*/React.createElement("h1", {
    className: "display-1 display-1--light"
  }, "Du hast deinen", /*#__PURE__*/React.createElement("br", null), "Verein gerade", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "display-1__accent"
  }, "unterst\xFCtzt.")), /*#__PURE__*/React.createElement("p", {
    className: "lede lede--light"
  }, "Wir k\xFCmmern uns ab jetzt um Druck und Versand. In 5\u20137 Werktagen ist dein Lieblingsteil bei dir."), /*#__PURE__*/React.createElement("div", {
    className: "sm-hero__buttons",
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-lg",
    onClick: onHome
  }, "Zur\xFCck zum Start"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost-light btn-lg",
    onClick: onHome
  }, "Noch einen Hero supporten"))));
}
window.SMCheckoutSuccess = CheckoutSuccess;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Cart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ClubSurfaces.jsx
try { (() => {
/* global React */
function ClubBanner({
  club,
  onBack
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "sm-club-banner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-club-banner__bg",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container sm-club-banner__inner"
  }, /*#__PURE__*/React.createElement("button", {
    className: "back-link",
    onClick: onBack
  }, "\u2190 Zur\xFCck"), /*#__PURE__*/React.createElement("div", {
    className: "sm-crest"
  }, club.crest), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow eyebrow--light"
  }, club.tag), /*#__PURE__*/React.createElement("h1", {
    className: "display-2 display-2--light"
  }, club.name), /*#__PURE__*/React.createElement("p", {
    className: "lede lede--light"
  }, club.desc), /*#__PURE__*/React.createElement("div", {
    className: "sm-club-banner__meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, club.players), " Spieler"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, club.season), " Saison"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, club.location)))));
}
window.SMClubBanner = ClubBanner;
function PlayerGrid({
  players,
  onPlayer
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "sm-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-grid-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Mannschaft \xB7 Kampfmannschaft Herren"), /*#__PURE__*/React.createElement("h2", {
    className: "display-2"
  }, "W\xE4hl deinen Local Hero.")), /*#__PURE__*/React.createElement("div", {
    className: "sm-player-grid"
  }, players.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: "sm-player-card",
    onClick: () => onPlayer(p)
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-player-card__num",
    style: {
      background: p.bg
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "number-trail"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t t-4"
  }, p.num), /*#__PURE__*/React.createElement("span", {
    className: "t t-3"
  }, p.num), /*#__PURE__*/React.createElement("span", {
    className: "t t-2"
  }, p.num), /*#__PURE__*/React.createElement("span", {
    className: "t t-1"
  }, p.num), /*#__PURE__*/React.createElement("span", {
    className: "t t-0"
  }, p.num))), /*#__PURE__*/React.createElement("div", {
    className: "sm-player-card__meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-player-card__name"
  }, p.name), /*#__PURE__*/React.createElement("div", {
    className: "sm-player-card__pos"
  }, p.pos)), p.hero && /*#__PURE__*/React.createElement("span", {
    className: "badge badge-yellow sm-player-card__badge"
  }, "Local Hero"))))));
}
window.SMPlayerGrid = PlayerGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ClubSurfaces.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
/* global React */
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "sm-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-footer__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-footer__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-long-white.png",
    alt: "Sportmerch"
  }), /*#__PURE__*/React.createElement("p", {
    className: "sm-footer__tag"
  }, "Support, so wie du ihn verdienst.")), /*#__PURE__*/React.createElement("div", {
    className: "sm-footer__col"
  }, /*#__PURE__*/React.createElement("h5", null, "F\xFCr Vereine"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Vereinsanmeldung"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Wie funktioniert's"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Preise & Margen"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "FAQ")), /*#__PURE__*/React.createElement("div", {
    className: "sm-footer__col"
  }, /*#__PURE__*/React.createElement("h5", null, "F\xFCr Fans"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Vereine entdecken"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Versand & Retouren"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Gr\xF6\xDFentabelle"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Kontakt")), /*#__PURE__*/React.createElement("div", {
    className: "sm-footer__col"
  }, /*#__PURE__*/React.createElement("h5", null, "Sportmerch"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Manifest"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\xDCber uns"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Presse"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Karriere"))), /*#__PURE__*/React.createElement("div", {
    className: "sm-footer__legal"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Sportmerch GmbH \xB7 sportmerch.at"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Impressum"), " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Datenschutz"), " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "AGB")))));
}
window.SMFooter = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
/* global React */
const {
  useState
} = React;
function Header({
  onNav,
  view
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = e => {
      const t = e.target.scrollTop || 0;
      setScrolled(t > 12);
    };
    const root = document.querySelector('.site-scroll');
    if (root) root.addEventListener('scroll', onScroll);
    return () => root && root.removeEventListener('scroll', onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    className: 'sm-header' + (scrolled ? ' is-scrolled' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-header__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "sm-header__brand",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('home');
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-long-white.png",
    alt: "Sportmerch"
  })), /*#__PURE__*/React.createElement("nav", {
    className: "sm-header__nav"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('home');
    },
    className: view === 'home' ? 'is-active' : ''
  }, "Start"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('club');
    },
    className: view === 'club' || view === 'player' || view === 'product' ? 'is-active' : ''
  }, "Vereine"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('home');
    }
  }, "Manifest"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('home');
    }
  }, "\xDCber uns")), /*#__PURE__*/React.createElement("div", {
    className: "sm-header__cta"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost-light",
    onClick: () => onNav('club')
  }, "Vereine entdecken"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => onNav('club')
  }, "Mein Shop starten"))));
}
window.SMHeader = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
/* global React */
function Hero({
  onPrimary,
  onSecondary
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "sm-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-hero__bg",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-hero__photo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-hero__scrim"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm-hero__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-hero__copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow eyebrow--light"
  }, "Made for Local Heroes"), /*#__PURE__*/React.createElement("h1", {
    className: "display-1"
  }, "Du spielst", /*#__PURE__*/React.createElement("br", null), "das Spiel.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "display-1__accent"
  }, "Wir den Shop.")), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Sportmerch ist die kostenlose Plattform f\xFCr Amateur- und Nachwuchsvereine. Jeder Spielerin und jedem Spieler eine eigene Shopseite. Hochwertiger Merch, Name und Nummer \u2014 wie bei den Gro\xDFen."), /*#__PURE__*/React.createElement("div", {
    className: "sm-hero__buttons"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-lg",
    onClick: onPrimary
  }, "Jetzt Shop starten"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost-light btn-lg",
    onClick: onSecondary
  }, "Wie es funktioniert"))), /*#__PURE__*/React.createElement("div", {
    className: "sm-hero__number",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "number-trail"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t t-4"
  }, "7"), /*#__PURE__*/React.createElement("span", {
    className: "t t-3"
  }, "7"), /*#__PURE__*/React.createElement("span", {
    className: "t t-2"
  }, "7"), /*#__PURE__*/React.createElement("span", {
    className: "t t-1"
  }, "7"), /*#__PURE__*/React.createElement("span", {
    className: "t t-0"
  }, "7")), /*#__PURE__*/React.createElement("div", {
    className: "sm-hero__name"
  }, "YILMAZ"))));
}
window.SMHero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Sections.jsx
try { (() => {
/* global React */
function HowItWorks() {
  const steps = [{
    n: '01',
    t: 'Verein anmelden',
    d: 'In wenigen Minuten registriert. Wir richten alles ein. Ohne Risiko, ohne Setupkosten.'
  }, {
    n: '02',
    t: 'Spieler-Shops',
    d: 'Jedes Mitglied bekommt eine eigene Shopseite mit Name, Nummer und Vereinsdesign.'
  }, {
    n: '03',
    t: 'Vereinskasse füllen',
    d: 'Jeder Kauf fließt direkt zurück in den Verein. Wir kümmern uns um Druck und Versand.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "sm-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "So funktioniert's"), /*#__PURE__*/React.createElement("h2", {
    className: "display-2"
  }, "In drei Schritten zum Vereins-Shop."), /*#__PURE__*/React.createElement("div", {
    className: "sm-steps"
  }, steps.map(s => /*#__PURE__*/React.createElement("div", {
    className: "sm-step",
    key: s.n
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-step__num"
  }, s.n), /*#__PURE__*/React.createElement("h3", {
    className: "sm-step__title"
  }, s.t), /*#__PURE__*/React.createElement("p", {
    className: "sm-step__copy"
  }, s.d))))));
}
window.SMHowItWorks = HowItWorks;
function ImpactBlock() {
  const stats = [{
    n: '0 €',
    l: 'Setup-Kosten für deinen Verein'
  }, {
    n: '100 %',
    l: 'des Aufschlags fließt zurück'
  }, {
    n: '48 h',
    l: 'bis dein Spielershop online ist'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "sm-section sm-section--inverse"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-impact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-impact__copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow eyebrow--light"
  }, "Was reinkommt, bleibt drin"), /*#__PURE__*/React.createElement("h2", {
    className: "display-2 display-2--light"
  }, "Jeder Kauf f\xFCllt direkt die Vereinskasse."), /*#__PURE__*/React.createElement("p", {
    className: "lede lede--light"
  }, "Keine versteckten Geb\xFChren. Keine Mindestabnahme. Keine Lagerkosten. Was du als Fan zahlst, kommt zu gro\xDFen Teilen direkt bei deinem Verein an.")), /*#__PURE__*/React.createElement("div", {
    className: "sm-impact__stats"
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    className: "sm-stat",
    key: s.l
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-stat__num"
  }, s.n), /*#__PURE__*/React.createElement("div", {
    className: "sm-stat__lbl"
  }, s.l)))))));
}
window.SMImpactBlock = ImpactBlock;
function ManifestoBlock() {
  return /*#__PURE__*/React.createElement("section", {
    className: "sm-section sm-section--manifesto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Das Manifest"), /*#__PURE__*/React.createElement("h2", {
    className: "display-1 display-1--manifesto"
  }, "Zusammenhalt ist ", /*#__PURE__*/React.createElement("span", {
    className: "display-1__accent"
  }, "kein\xA0Privileg"), " der Profis."), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "W\xE4hrend der Profisport in Budgets und neuen Monetarisierungswegen schwimmt, fragen wir uns: Was ist mit unserem Nachwuchs? Was ist mit denen, die ihre gesamte Leidenschaft auf den Platz bringen, die niemals aufgeben und trotz Ehrenamts und \xDCberstunden jede Woche alles geben?"), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Wir glauben: Leidenschaft darf nicht am Budget scheitern. Wir k\xE4mpfen gegen b\xFCrokratische H\xFCrden und gegen die riesige L\xFCcke zwischen Profi-Zirkus und Basis-Arbeit."), /*#__PURE__*/React.createElement("p", {
    className: "manifesto-sign"
  }, "\u2014 F\xFCr die Liebe zum Spiel. F\xFCr euren Verein.")));
}
window.SMManifestoBlock = ManifestoBlock;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Shop.jsx
try { (() => {
/* global React */
const {
  useState: useState_p
} = React;
function PlayerShop({
  player,
  club,
  onBack,
  onProduct
}) {
  const products = [{
    id: 'p1',
    t: 'Heimtrikot',
    sub: 'Saison 25/26',
    price: '€ 49,90',
    bg: 'linear-gradient(135deg,#1e3a5f,#3a6499)',
    hero: true
  }, {
    id: 'p2',
    t: 'Auswärtstrikot',
    sub: 'Saison 25/26',
    price: '€ 49,90',
    bg: 'linear-gradient(135deg,#d72638,#a81c2a)'
  }, {
    id: 'p3',
    t: 'Hoodie',
    sub: 'Vereins-Edition',
    price: '€ 64,90',
    bg: 'linear-gradient(135deg,#0f1d31,#142a47)'
  }, {
    id: 'p4',
    t: 'Schal',
    sub: 'Doppelseitig gewebt',
    price: '€ 19,90',
    bg: 'linear-gradient(135deg,#d72638,#1e3a5f)'
  }, {
    id: 'p5',
    t: 'Cap',
    sub: 'Snapback',
    price: '€ 24,90',
    bg: 'linear-gradient(135deg,#1e3a5f,#0f1d31)'
  }, {
    id: 'p6',
    t: 'T-Shirt',
    sub: 'Baumwolle, schwer',
    price: '€ 29,90',
    bg: 'linear-gradient(135deg,#f4a900,#d99500)'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "sm-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("button", {
    className: "back-link",
    onClick: onBack
  }, "\u2190 Zur\xFCck zu ", club.name), /*#__PURE__*/React.createElement("div", {
    className: "sm-player-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-player-head__num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "number-trail"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t t-4"
  }, player.num), /*#__PURE__*/React.createElement("span", {
    className: "t t-3"
  }, player.num), /*#__PURE__*/React.createElement("span", {
    className: "t t-2"
  }, player.num), /*#__PURE__*/React.createElement("span", {
    className: "t t-1"
  }, player.num), /*#__PURE__*/React.createElement("span", {
    className: "t t-0"
  }, player.num))), /*#__PURE__*/React.createElement("div", {
    className: "sm-player-head__copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, club.name, " \xB7 ", player.pos), /*#__PURE__*/React.createElement("h1", {
    className: "display-1"
  }, player.name.toUpperCase()), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Trikot, Hoodie, Schal \u2014 mit deinem Namen oder dem von ", player.name.split(' ')[0], ". Jeder Kauf f\xFCllt direkt die Vereinskasse von ", club.name, "."))), /*#__PURE__*/React.createElement("div", {
    className: "sm-product-grid"
  }, products.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: 'product-card' + (p.hero ? ' product-card--feat' : ''),
    onClick: () => onProduct({
      ...p,
      player
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "product-card__img",
    style: {
      background: p.bg
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "product-card__num"
  }, player.num), p.hero && /*#__PURE__*/React.createElement("span", {
    className: "ribbon"
  }, "Bestseller")), /*#__PURE__*/React.createElement("div", {
    className: "product-card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "product-card__title"
  }, p.t), /*#__PURE__*/React.createElement("div", {
    className: "product-card__sub"
  }, p.sub), /*#__PURE__*/React.createElement("div", {
    className: "product-card__price"
  }, p.price)))))));
}
window.SMPlayerShop = PlayerShop;
function ProductDetail({
  product,
  onBack,
  onAdd
}) {
  const [size, setSize] = useState_p('M');
  const [custom, setCustom] = useState_p(true);
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  return /*#__PURE__*/React.createElement("section", {
    className: "sm-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container sm-product-detail"
  }, /*#__PURE__*/React.createElement("button", {
    className: "back-link",
    onClick: onBack
  }, "\u2190 Zur\xFCck"), /*#__PURE__*/React.createElement("div", {
    className: "sm-product-detail__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-product-detail__visual",
    style: {
      background: product.bg
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-product-detail__num"
  }, product.player.num), /*#__PURE__*/React.createElement("span", {
    className: "sm-product-detail__name"
  }, product.player.name.split(' ').slice(-1)[0].toUpperCase())), /*#__PURE__*/React.createElement("div", {
    className: "sm-product-detail__copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, product.t, " \xB7 ", product.sub), /*#__PURE__*/React.createElement("h1", {
    className: "display-2"
  }, product.t, " ", product.player.name.split(' ').slice(-1)[0]), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Schwerer Stoff, saubere N\xE4hte, ein Druck der bleibt. Lieblingsteile statt nur Merch."), /*#__PURE__*/React.createElement("div", {
    className: "field-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Gr\xF6\xDFe"), /*#__PURE__*/React.createElement("div", {
    className: "size-row"
  }, sizes.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: 'chip' + (size === s ? ' chip--active' : ''),
    onClick: () => setSize(s)
  }, s)))), /*#__PURE__*/React.createElement("div", {
    className: "field-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Personalisierung"), /*#__PURE__*/React.createElement("label", {
    className: "check-row"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: custom,
    onChange: e => setCustom(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "Name + Nummer wie auf dem Trikot (", product.player.name.split(' ').slice(-1)[0].toUpperCase(), " \xB7 ", product.player.num, ")"))), /*#__PURE__*/React.createElement("div", {
    className: "impact-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "impact-row__num"
  }, "\u20AC 12,40"), /*#__PURE__*/React.createElement("div", {
    className: "impact-row__lbl"
  }, "gehen direkt an ", product.player.name.split(' ')[0], "s Verein."))), /*#__PURE__*/React.createElement("div", {
    className: "price-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "price-row__price"
  }, product.price), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-lg",
    onClick: () => onAdd({
      ...product,
      size,
      custom
    })
  }, "In den Warenkorb"))))));
}
window.SMProductDetail = ProductDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Shop.jsx", error: String((e && e.message) || e) }); }

})();
