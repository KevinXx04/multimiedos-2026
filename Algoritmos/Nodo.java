public class Nodo
{
    int dato;
    Nodo siguiente;

    public Nodo(int dato) 
    {
        this.dato = dato;
        this.siguiente = null;
    }
    public void setDato(int dato)
    {
        this.dato = dato;
    }

    public int getDato()
    {
        return dato;
    }

    public  void setSiguiente(Nodo siguiente)
    {
        this.siguiente = siguiente;
    }

    public Nodo getSiguiente()
    {
        return siguiente;
    }


}//fin de class