const pathname = window.location.pathname;
const dispTitle = document.getElementById("displayTitle");
const navHome = document.getElementById("navHome");
const navByty = document.getElementById("navByty");
const navRod = document.getElementById("navRod");
const navObch = document.getElementById("navObch");
const navStav = document.getElementById("navStav");
const navChat = document.getElementById("navChat");
const navOrn = document.getElementById("navOrn");
const navGar = document.getElementById("navGar");
const navPre = document.getElementById("navPre");
const navProfil = document.getElementById("navProfil");
const navKont = document.getElementById("navKont");

if (pathname.startsWith("/all/byty")) {
  navByty.classList.add("active");
  navHome.classList.remove("active");
  if(pathname.endsWith("=hu")) {
    dispTitle.innerHTML = "Reflex-Reality | Lakások";
  } else {
    dispTitle.innerHTML = "Reflex-Reality | Byty";
  }
} else if (pathname.startsWith("/all/rodinne-domy")) {
  navRod.classList.add("active");
  navHome.classList.remove("active");
  if(pathname.endsWith("=hu")) {
    dispTitle.innerHTML = "Reflex-Reality | Családi házak";
  } else {
    dispTitle.innerHTML = "Reflex-Reality | Rodinné domy";
  }
} else if (pathname.startsWith("/all/obchodne-priestory")) {
  navObch.classList.add("active");
  navHome.classList.remove("active");
  if(pathname.endsWith("=hu")) {
    dispTitle.innerHTML = "Reflex-Reality | Üzlethelyiségek";
  } else {
    dispTitle.innerHTML = "Reflex-Reality | Obchodné priestory";
  }
} else if (pathname.startsWith("/all/stavebne-pozemky")) {
  navStav.classList.add("active");
  navHome.classList.remove("active");
  if(pathname.endsWith("=hu")) {
    dispTitle.innerHTML = "Reflex-Reality | Építkezési telkek";
  } else {
    dispTitle.innerHTML = "Reflex-Reality | Stavebné pozemky";
  }
} else if (pathname.startsWith("/all/chaty-a-zahrady")) {
  navChat.classList.add("active");
  navHome.classList.remove("active");
  if(pathname.endsWith("=hu")) {
    dispTitle.innerHTML = "Reflex-Reality | Nyaralók és kertek";
  } else {
    dispTitle.innerHTML = "Reflex-Reality | Chaty a záhrady";
  }
} else if (pathname.startsWith("/all/orna-poda")) {
  navOrn.classList.add("active");
  navHome.classList.remove("active");
  if(pathname.endsWith("=hu")) {
    dispTitle.innerHTML = "Reflex-Reality | Szántóföldek";
  } else {
    dispTitle.innerHTML = "Reflex-Reality | Orná pôda";
  }
} else if (pathname.startsWith("/all/garaze")) {
  navGar.classList.add("active");
  navHome.classList.remove("active");
  if(pathname.endsWith("=hu")) {
    dispTitle.innerHTML = "Reflex-Reality | Garázsok";
  } else {
    dispTitle.innerHTML = "Reflex-Reality | Garáže";
  }
} else if (pathname.startsWith("/all/prenajom")) {
  navPre.classList.add("active");
  navHome.classList.remove("active");
  if(pathname.endsWith("=hu")) {
    dispTitle.innerHTML = "Reflex-Reality | Bérbeadás";
  } else {
    dispTitle.innerHTML = "Reflex-Reality | Prenájom";
  }
} else if (pathname.startsWith("/users")) {
  dispTitle.innerHTML = "Reflex-Reality | Môj profil";
  navProfil.classList.add("active");
  navHome.classList.remove("active");
} else if (pathname.startsWith("/admin")) {
  dispTitle.innerHTML = "Reflex-Reality | Admin";
} else if (pathname.startsWith("/contact")) {
  navKont.classList.add("active");
  navHome.classList.remove("active");
  if(pathname.endsWith("=hu")) {
    dispTitle.innerHTML = "Reflex-Reality | Kapcsolat";
  } else {
    dispTitle.innerHTML = "Reflex-Reality | Kontakt";
  }
} else if (pathname.startsWith("/search-results")) {
  if(path.endsWith("=hu")) {
    dispTitle.innerHTML = "Reflex-Reality | Keresés eredményei";
  } else {
    dispTitle.innerHTML = "Reflex-Reality | Výsledky hľadania";
  }
} else if (pathname.startsWith("/lang=hu")) {
  dispTitle.innerHTML = "Reflex-Reality | Főoldal";
} else {
  dispTitle.innerHTML = "Reflex-Reality";
}

// if(pathname !== "/") {
//   navHome.classList.remove("active");
// }