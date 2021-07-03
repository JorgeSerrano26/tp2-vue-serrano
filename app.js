new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
        },

        atacar: function () {
            const damage = this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo -= damage;
            this.registrarEvento({
                esJugador: true,
                texto: `El jugador golpea al monstruo por ${damage}`
            });
            if(this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            const damage = this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo -= damage;
            this.registrarEvento({
                esJugador: true,
                texto: `El jugador golpea al monstruo por ${damage}`
            });
            if(this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            if(this.saludJugador <= 90){
                this.saludJugador += 10;
            }else{
                this.saludJugador = 100;
            }
            this.registrarEvento({ 
                esJugador: true,
                texto: `El jugador se recuperó 10 puntos`
            })
            this.ataqueDelMonstruo()
        },

        registrarEvento(evento) {
            this.turnos.unshift(evento);
        },

        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            const damage = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.registrarEvento({
                esJugador: false,
                texto: `El monstruo golpea al jugador por ${damage}`
            });
            this.saludJugador -= damage;
            this.verificarGanador();
        },

        calcularHeridas: function (rango) {
            const [min, max] = rango;
            const damage = Math.max(Math.floor(Math.random() * max) + 1, min);
            return damage;
        },
        verificarGanador: function () {
            if(this.saludMonstruo <= 0){
                if(confirm('Ganaste! Jugar de nuevo?')){
                    this.empezarPartida();
                }else{ 
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            }else if(this.saludJugador <= 0){
                if(confirm('Perdiste! Jugar de nuevo?')){
                    this.empezarPartida();
                }else{ 
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});