 
 
def res(func):
      def wrapper():
            print("1")
            res  = func()
            print("2")
      return wrapper

@res
def print_res():
      print("res")

print_res()

      
 
 