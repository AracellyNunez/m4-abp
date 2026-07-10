export class UnidadSangre {
    constructor({ id, grupoFactor, componente, estado = "En Análisis" }) {
        this.id = id;
        this.grupoFactor = grupoFactor;
        this.componente = componente;
        this.fechaIngreso = new Date().toLocaleDateString();
        this.estado = estado;
    }

    cambiarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }
}

export class GestorInventario {
    constructor() {
        this.unidades = [];
    }

    existeId(id) {
        return this.unidades.some(unidad => unidad.id === id);
    }

    agregarUnidad(unidad) {
        this.unidades.push(unidad);
    }

    eliminarUnidad(id) {
        this.unidades = this.unidades.filter(u => u.id !== id);
    }

    obtenerUnidades() {
        return this.unidades;
    }
}