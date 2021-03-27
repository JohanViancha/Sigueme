
var jugadores = [];
const niveles = 10;
let nivel=1;
const colores = [{nombre:'primero',valor : 0},{nombre:'segundo',valor : 1},{nombre:'tercero',valor :2},{nombre:'cuarto',valor : 3}];
let secuencias = [];
let subnivel=0;
let cantColoresSeleccionado =0;
let control_tiempo = null;
let unidadesm = 0;
let decimasm = 0;
let unidadess=0;
let decimass=0;
let milisegundos=0;

audioIncorrecto = new Audio('audio/incorrecto.mp3');
audiogameover = new Audio('audio/gameover.mp3');
audiosubirNivel = new Audio('audio/subir-nivel.mp3');
audioganar = new Audio('audio/ganar.mp3');
//var respuesta=true;

const seleccionar_jugador = ()=>{
	tb_puntajes.rows[jugadores.length].style.background = '#546CFF';
	tb_puntajes.rows[jugadores.length].style.color  = '#FFF';
}

const deseleccionar_jugador = (fila)=>{
	return new Promise((resolve,reject)=>{
		resolve(fila);
	})
}


const abrir_juego = ()=>{
	empezar.style.display = 'none';
	tiempo.style.display = 'none';
	inicio.style.display = 'block';
}

const en_juego = ()=>{

	empezar.addEventListener('click', empezar_juego);

}

const iniciar = ()=>{

	Swal.fire({
		title: 'Ingrese su nombre',
		input: 'text',
		showCancelButton: true,
	})
	.then(result=>{
		if(result.isConfirmed && result.value != ""){
			jugadores.push({nombre:result.value, nivel:0, tiempo:'00:00:00'});
			empezar.style.display = 'inline-block';
			inicio.style.display = 'none';
			agregar_jugador(jugadores);
			en_juego();
		}
		else{
			Swal.fire(
		      'No se ingreso el nombre del jugador',
		      '',
		      'error'
		    )
		}
	})
}


const agregar_jugador = (jugador)=>{
	var nuevaFila   = tb_puntajes.insertRow(jugador.length);
	var nom  = nuevaFila.insertCell(0);
	var niv = nuevaFila.insertCell(1);
	var tie = nuevaFila.insertCell(2);
	var newText  = document.createTextNode(jugador[jugador.length-1].nombre);
	nom.appendChild(newText);
	var newText  = document.createTextNode(jugador[jugador.length-1].nivel);
	niv.appendChild(newText);
	var newText  = document.createTextNode(jugador[jugador.length-1].tiempo);
	tie.appendChild(newText);

	if(tb_puntajes.rows.length > 1){
		deseleccionar_jugador(nuevaFila).then((fila)=> {
			fila.style.background = '#FFF';
			fila.style.color = '#000';

		}).then(()=>{
			seleccionar_jugador();
		});
	}
		


}


const empezar_juego = ()=>{

	Swal.fire({
		title: 'Sigue la secuencia de colores que se iluminará',
		text:'Nivel '+nivel,
		icon:'info',
		showCancelButton: false,
	}).then((result)=>{
		if(result){
			iluminar_color();
			tiempo.style.display = 'inline-block';
			iniciar_tiempo();
			tiempo.classList.add('tiempo');	
		}
	},1000);
	
}

const parar_tiempo = ()=>{

	clearInterval(control_tiempo);
}

const iniciar_tiempo = ()=>{
	
	control_tiempo = setInterval(()=>{
	if(milisegundos == 100){
		milisegundos =0;
		unidadess++;
	}

	if(unidadess ==10){
		unidadess=0;
		decimass++;
	}

	if(decimass == 6){
		unidadesm++;
		decimass=0;
	}
	if(unidadesm==10){
		decimasm++;
		unidadesm=0;
	}
	tiempo.innerHTML = ''+decimasm+unidadesm +' : ' + decimass+unidadess+' : '+milisegundos;
	milisegundos++;
	},10);
		


}
const iluminar_color = ()=>{
	primero.removeEventListener('click', validar_color);
	segundo.removeEventListener('click', validar_color);
	tercero.removeEventListener('click', validar_color);
	cuarto.removeEventListener('click', validar_color);

	let secuencia = Math.floor((Math.random()*4));
	let tiempo=300;
	secuencias.push(secuencia);
	
	secuencias.forEach((index)=> {
		const color = document.getElementById(colores[index].nombre);
		setTimeout(()=>{
		color.classList.add('iluminar');
		},tiempo)

		setTimeout(()=>{
			color.classList.remove('iluminar');
		},tiempo+500)
		
		tiempo+=800;
	});

	//if(respuesta){
		setTimeout(()=>{
		const Toast = Swal.mixin({
		  toast: true,
		  position: 'top-right',
		  showConfirmButton: false,
		  timer: (secuencias.length*1200)-(secuencias.length*100),
		  timerProgressBar: true,
		})

		primero.addEventListener('click', validar_color);
		segundo.addEventListener('click', validar_color);
		tercero.addEventListener('click', validar_color);
		cuarto.addEventListener('click', validar_color);

		Toast.fire({
		  icon: 'question',
		  title: 'Es tu turno'
		}).then((result)=>{

			if(cantColoresSeleccionado < secuencias.length){
				parar_tiempo();
				audioIncorrecto.play();
				Swal.fire({
					title: '¡Se acabo el tiempo',
					text:'No has seleccionado todos los colores, has perdido',
					icon:'error',
					showCancelButton: false
				}).then((result)=>{
					if(result){
						perdedor();
					}
				});
			}
		})
		},tiempo);
	//}

	
	
}


const validar_color = (ev)=>{
		cantColoresSeleccionado++;
		ev.target.classList.add('iluminar');
	
		setTimeout(()=>{
			ev.target.classList.remove('iluminar');
		},200)
	if(ev.target.id == colores[secuencias[subnivel]].nombre){
		subnivel++
		if(subnivel == secuencias.length){

			if(nivel==niveles){

				ganador();
			}
			else{
				audiosubirNivel.play();
				parar_tiempo();
				Swal.fire({
				title: '¡Muy bien, has acertado',
				text:'Nivel '+nivel,
				icon:'success',
				showCancelButton: false,
				}).then((result)=>{
					if(result){
						subnivel=0;
						iluminar_color();
						iniciar_tiempo();
						cantColoresSeleccionado=0;
					}
				});

			}
			
			nivel++;
		}
		
	
	}
	else{
		perdedor();
	}
	
	
}

const ganador=()=>{
		Swal.fire({
				title: '¡Has ganado!',
				icon:'success',
			}).then((result)=>{
			audioganar.play();
			result:fin_juego();
		});;

		
}


const perdedor = ()=>{
	Swal.fire({
		title: 'Has perdido, gameover',
		icon:'error',
		showCancelButton: false,
		}).then((result)=>{
			audiogameover.play();
			result:fin_juego();
		});


	
}

const fin_juego = ()=>{
	empezar.removeEventListener('click', empezar_juego);
	actualizar_jugador();
	parar_tiempo();
	unidadesm = 0;
	decimasm = 0;
	unidadess=0;
	decimass=0;
	milisegundos=0;
	nivel=1;
	subnivel =0;
	cantColoresSeleccionado=0;
	//respuesta = true;
	secuencias=[];

	primero.removeEventListener('click', validar_color);
	segundo.removeEventListener('click', validar_color);
	tercero.removeEventListener('click', validar_color);
	cuarto.removeEventListener('click', validar_color);

}

const actualizar_jugador = ()=>{
	tb_puntajes.rows[jugadores.length].cells[2].innerText = tiempo.innerText;
	tb_puntajes.rows[jugadores.length].cells[1].innerText = nivel-1;

	tb_puntajes.rows[jugadores.length].classList.add('parpadeo')
	setTimeout(()=> {
		tb_puntajes.rows[jugadores.length].classList.add('blankear');
		abrir_juego();	
	}, 6000);
		

	
}
abrir_juego();
