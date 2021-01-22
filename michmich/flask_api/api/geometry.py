import numpy as np 

def normalize(vect):
    vect = np.array(vect)
    return vect/vect.max()


def deplace(center,point,poid):
    x_center = center[0]
    y_center = center[1]
    x = point[0]
    y = point[1]
    return [poid*x-(poid-1)*x_center,poid*y-(poid-1)*y_center]


def distance(a,b):
    return np.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2)