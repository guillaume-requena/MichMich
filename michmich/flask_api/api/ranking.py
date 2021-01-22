import numpy as np 

def global_note(row,col,coef):
    coef = np.array(coef)
    ranking = np.array([row[c] for c in col])
    ranking_weighted = coef*ranking
    return ranking_weighted.sum()/coef.sum()

def list_rank(x,asc=True):
    seq = sorted(x)
    index = [seq.index(v) for v in x]
    if asc:
        index = len(index) - np.array(index)
    else: 
        index = np.array(index)+1
    return index