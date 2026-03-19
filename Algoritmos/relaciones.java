public class relaciones 
{
    Nodo primero,ultimo,nuevo,rec,aux,anterior;

    public void agregarAlInicio(int datos)
    {
        nuevo = new Nodo(datos);
        if(primero==null)
        {
            primero=nuevo;
            ultimo=nuevo;
        }
        else
        {
            nuevo.setSiguiente(primero);
            primero=nuevo;
        }
    }

    public void agregarAlFinal(int datos)
    {
        nuevo=new Nodo(datos);
        if(primero==null)
        {
            primero=nuevo;
            ultimo=nuevo;
        }
        else
        {
            ultimo.setSiguiente(nuevo);
            ultimo=nuevo;
        }
    }

    public String imprimir()
    {
        String mensaje = "";
        if (primero==null)
        {
            mensaje="La lista se encuentra vacia";
        }
        else
        {
            rec=primero;
            while(rec!=null)
            {
                mensaje+=rec.getDato()+"\n";
                rec=rec.getSiguiente();
            }
            return mensaje;
        }
        return mensaje;

    }
    public String agregarDespuesDe(int datos,int buscar) 
    {
        String mensaje = "";
        if(primero==null)
        {
             mensaje="La lista se encuentra vacia";
        }
        else
        {
            rec=primero;
            while(rec!=null)
            {
                if(rec.getDato()==buscar)
                {
                    aux = new Nodo(datos);
                    aux.setSiguiente(rec.getSiguiente());
                    rec.setSiguiente(aux);
                    mensaje="El elemento fue agregado correctamente";
                    break;
                }
                else
                {
                    rec=rec.getSiguiente();
                }
                
            }
        }
        return mensaje;
    }

    public String eliminar(int buscar)
    {
        String mensaje = "";
        if (primero==null)
        {
            mensaje="La lista se encuentra vacia";
        }
        else
        {
            rec=primero;
            anterior=null;
            mensaje="Se elimino correctamente";
            while (rec!=null) 
            {
                if(rec.getDato()==buscar)
                {
                    if(rec==primero)
                    {
                        primero=primero.getSiguiente();
                        if(primero==null)
                        {
                            ultimo=null;
                            mensaje="Se elimino correctamente";
                        }
                        else
                        {
                            anterior.setSiguiente(rec.getSiguiente());
                            if(rec==ultimo)
                            {
                                ultimo=anterior;
                                mensaje="Se elimino correctamente";
                            }
                        }
                    }
                    break;
                }
                else
                {
                    anterior=rec;
                    rec=rec.getSiguiente();
                    mensaje="Se elimino correctamente";
                }
            }

        }
        return mensaje;
    
    }

    public String buscar(int datos)
    {   
        String mensaje="";
        if(primero==null)
        {
            mensaje="La lista se encuentra vacia";
        }
        else
        {
            rec=primero;
            encontra

        }
    }
    
}//fin de class
