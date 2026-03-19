import javax.swing.JOptionPane;


public class main 
{
    public static void main (String args[])
    {
        relaciones Relaciones = new relaciones();

        int menu,datos,buscar;
        do
        {
            menu=Integer.parseInt(JOptionPane.showInputDialog("Escoja una opcion:+\n1)Agregar al inicio\n2)Agregar al final\n3)Imprimir\n4)Agregar despues de\n5)Eliminar un elemento\n6)Eliminar la lista\n7)Salir"));
            switch (menu) 
            {
                case 1:
                    datos=Integer.parseInt(JOptionPane.showInputDialog("Ingrese un dato numerico:"));
                    Relaciones.agregarAlInicio(datos);
                    break;
                case 2:
                    datos=Integer.parseInt(JOptionPane.showInputDialog("Ingrese un dato numerico, para agregar al final:"));
                    Relaciones.agregarAlFinal(datos);
                    break;
                case 3:
                    JOptionPane.showMessageDialog(null, Relaciones.imprimir());
                    break;
                case 4:
                    datos=Integer.parseInt(JOptionPane.showInputDialog("Ingrese un dato para agregar despues de :"));
                    buscar=Integer.parseInt(JOptionPane.showInputDialog("Ingrese un dato para buscar :"));

                    Relaciones.agregarDespuesDe(datos, buscar);
                    break;
                case 5:
                    break;
                case 6:
                    break;
                case 7:
                    JOptionPane.showMessageDialog(null,"Muchas gracias");
                    break;
                default:
                    JOptionPane.showMessageDialog(null,"Debe seleccionar una opcion valida");
            }
        }while(menu!=7);


    }//fin del static

}//fin de la class
