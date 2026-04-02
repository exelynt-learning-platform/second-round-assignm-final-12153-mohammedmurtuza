class wrapper{
    public static void main (String args[]){
        int a = 10;
        Integer b = Integer.valueOf(a); //boxing
        Integer c = a; //autoboxing
        
        System.out.println("value of a: " + a);
        System.out.println("value of b: " + b);
        System.out.println("value of c: " + c);

        Integer x = new Integer(20);
        int y = x.intValue(); //unboxing
        int z = x; //autounboxing

        System.out.println("value of x: " + x);
        System.out.println("value of y: " + y);
        System.out.println("value of z: " + z);
    }
}