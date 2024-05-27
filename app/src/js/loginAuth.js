//http://localhost/swagger-ui
const form = document.querySelector('.sign-in-form');
const jwtPrivateKey =
	`-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-128-CBC,A441180230DFB4BD68AB1CF6C9944DEC

o7yWTbnoip9BzDSp+i0QVCEBfSvrp8lbTknqe0ZO9RoxOtYglf01i1fTlyLJEW6q
wlQQSLGM8/LqW8AOiOIUeYhRnTH/P8TjlUQ8EXbomAlvV3j2J29uONhBY3cgvvk9
ztcsKChpWQJd4ZLY2Pxj7K64d0yIcRZ7u+9UuMSoFd7qgefYIacNIooPaGP07agS
0s0PaYs229PvlLWsUFq3Zm24nq2TZEfpFTDB8u9D69kmPsMKhQtHvydnD+1UuMx5
BuTlKsJQ92rklYBYLchAwa8In9jSM5Cdsz0Z+v7c6jOn2dqSm8KdTY7cWxFWNCqk
FZxZXAmWsuHExSDZ+cZ2GhfOJpQp1ozp6Erw1tqsgOrz2TVAlPTS9KgVm2HEi8/M
0pXiZBK0OxFaQWVCrgJxI+G6c80lq6P3ghZ9QsU/I5wLE96xwxsBQE1irYapdzwi
mSzTkonKtvy6pZpB9nmaWnt1f5ZLlzCPSVglmE11LQ1/0S51w/eaw3v6PjnMnutY
XJaMQzGgDBr8BAvxbA4X/u9hIB6/YCEwQ46wd1jm/gY4QE3DicFqT7JloKWvYx7Z
TX7M+jWCCa91qHINhebpok42deVW9uB8/dQ+P6/UTnatq8qoRsL8XsIK38WWKeH1
vwHWVHRFSRX0lHeJ4bCDeQBP2cR6asAoGKMwieWL60I3MDTUGzddoFEqb41/9zem
LhZoQIdFkCqqkzbIqR4H+st3EzVGlpkZzjh20UYcfwHy+Ez6x549whyHNb7Ad7fz
aq/znJqaLDIyuOWctJFsH5eT5wr3/X76WZ+iKmQOKoEbojMwlh4ZulSM4KOD54gQ
AHZHXtHaloZ54dpkybmvutUYmXpFQBEpdTFttDWHwGcOOFXd5eVLY0dZ0QtqjT2V
ntwv9p+3yzgdvbq8eE+AMrgJZlcVQrZj37JucQir72SThA8+s9rs+yWt06jylYml
uIA7dt5jJCN9gKcdkvlW1+uMSlMhatO+X3uPN40whSoj5Ta9/qtEjv+YSFsytjeA
TKrob2tlGWHzNPfaDKxerVKrW2ut37wn/S79OPUX6gmn7LbjASuLQ5fyAz8CYXMc
prESD2x94GAT9P1eqbzscpV3nR2XiN0vjiGuRz0lH8xRI0knFYALDMG5rI9wlx9X
CMI8IzxQ8cWDKrRR8UZMbobOJZJZlNY4pOBSwaYL+CojqYJf3ufRg0rR7kcOgk1e
Bx9sIR1NGdGtq4sNrzV4oErylTT2ykSN+Smt0cdiljTxXt9jA5AqNBy1uEc0WJBm
SjNGYvGYWIOYMics8dJvgkY06zwLIORAJ/IC+dLIe1fYS21buSAViMN+KSjeQ2Q0
kT0oPDKKxg5GXJ4WRQYPrFYRsh4ULQtsb16SQWZQHgYZQhbvORvw+HVeulEN399J
GgMZpS9c0OlBgOb3EmYCsny9D64fjrbX+HT0jkj9hXYDopwZmhkVJo1nwd5/3Mpr
rvfF2fFDhJuMYAdokyVXkSoTDWX3nhEfAFYGBCjhV3YojPT6dD9mzlONaSZcpf5B
hW4IOBchqvzgYlM/WgrT/hj5hfXBg/iiSALnSffVMEw/2r+Tw7bwkuBs/41j/fF9
fUHfX0WJYfjv4i7gaxPLhFE7AWWDVjE9COML63OBYCp0vKLXVCDPcskJazjqxrH9
ATorQ7At7OXnMtW8D8F8NyekRvMnNfQ6ZFO8JKmfXBCGi+2c4pPdfrrledISsqV5
g2nKEMxP+tXz9NLOVx4B8koM2YKF0TrkQ2PgKH6cyXLnD12J+jIUPLq9nnaz0Rle
h7rNfHP3BevvHvmHnIxkMNgZuzyoTUdXGetAD+9W9bZ8pFzpHvpfsgTdm9c78eUX
aRD2NXu0cGjtq4vyjYFnhHDBpdw25+Rrr4uHbWnNAf9V5stG9jGWcls33c2vJHVW
gNOLWBxFak6r73buLahzCTDfY+RuUlPowhUHBr/Ob9v163Uabu5DWODUE+0KShkB
5ZJAYGNAct1CRxkEND2wx2Fue9sd1jHJwnTP+lpMd6yCypMRaFjS9Ur9sMoa880r
vbrKnBvwIw66IChnFu6IA2Lo+rMY7q6zmSauIkiVKklqEcfrIEyw+ue0fyhsd18y
9gUI/R8itII8/1LHt9y+vsP0zOHYhe28viD5U7LtMVf2pBKeT+zHbUCMNz6KKB/q
ZDfpK08KNUcGGzgvu6Tf2LFb8Gjmisd4J0Va/UO53yeXR7pbWtCdhHhqcYKGWBen
SeM0CrISmW9FhsPCRB0jtbpqC29Qo6tvx3aNSfXONeBEfe/hz5RLOgKrPsD1tYbb
2TmL5o9E9hkKk5RuhSp4N+NebQCS004K0A2+t/hquzIZ4ggJ8mJAbSPS0AYjItcT
y0LWpg6/CLbTD/IbqO6TzcLUfwxAAqFTxbGjdOEgwIox3xPYBC45kSNPgNJB9hKz
17DZ7Eu7bAkusbKPWU8kStPa9mXGTQNqEPMPq13/ii6cW1mDJpWxwQrFzCZc8IIk
5AZZPSNZG0tjL+vcqWORQjG0xn/7U8a64FJ9hvxYx0zvkFLrp3tEt+5qmrDell3h
OtK0PKJ4srCWFyXismjiZ7eBwPRQm11X0hSy5rEUu8075fE4usr/Sn/eN+AIcL6U
AbaG0/8MqY9l8g5wBmG/cNsZCj/w4ivdR781+LTlZZVAnxKVBh1abqVtfd2usjS8
dSygdVtd5cPYIyEgkuKq7HjjcPudsYcXh4RfIFSAl086eOLzBp3qt4rhspl8SSDO
jD4Kzm/A3cz37BVbi3dEHJHMHR+V5oVUod3tjlicsgLM6EaESPV+gbgxNjXU6AKK
gLr27Yn2X3sMLf2WOdjWlxvBRxyLeKIt5wO5/qw7MwPGKyVINMeEjs3ExFWwUjbq
W3/4F6Y4sJDK760og+CSR23IzYX6sPfdStLOHiYd7mlqhe3UEEvIxqS6xolFxntf
OHMm0vvESG7IufVahlf2kPSCoeiCKgbjbqC4ZKuFFxe97kdudL2AE9uo0Wgz34l3
Ht+39kxo16iFLaB+OQchaCTBQk9v+8wE3Dknmkv6OizgR/MS79CuEClMrDbrLohO
JdJOSBgtapR5Tc1nEM8/kEx18hjZ5Ugy7yNVvsC1CwVVAoJxf9AC4ZU+GOX4q2xP
-----END RSA PRIVATE KEY-----
`;

const url = new URL(window.location.href);
const hostname = url.hostname;
const port = url.port;
const urlBase = url.protocol + '//' + (port ? `${hostname}:${port}` : hostname);

const extension = 'php';
let userID = 0;
let firstName = "";
let lastName = "";
const ids = [];

//Allows User to Register using JST token and allows access to the contacts-page
function register() {

	let username = document.getElementById("user-name").value;
	let password = document.getElementById("password").value

	//needs to be updated to use google needs updating
	let tmp = {
		authentication_provider: "USERNAME_PASSWORD",
		username: username,
		password: password
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/api/register." + extension;

	const registration = async () => {
		const location = window.location.hostname;
		const settings = {
			method: 'POST',
			body: tmp,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			}
		};
		try {
			const fetchResponse = await fetch(url, settings);
			const data = await fetchResponse.json();
			console.log(data);
			setCookie("jwt", jwtPrivateKey, 15) // 15 minutes expiration
			
		} catch (e) {
			console.log(e);
		}    
	}

	registration();
}

function setCookie(name, value, minutes) {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + (minutes * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	const secureFlag = window.location.protocol === 'https:' ? '; secure' : '';
	document.cookie = name + "=" + (value || "") + expires + "; path=/" + secureFlag;
}

form.addEventListener('submit', function signUp(e) {
	e.preventDefault();
	register();
});