### 1. Calculus

#### Derivatives
The derivative of a function:
$$\frac{d}{dx}f(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

# Advanced Mathematics Examples

## Vector Calculus

### 1. Gradient
The gradient of a scalar field $f(x,y,z)$ is:
$$\nabla f = \frac{\partial f}{\partial x}\mathbf{i} + \frac{\partial f}{\partial y}\mathbf{j} + \frac{\partial f}{\partial z}\mathbf{k}$$

### 2. Divergence
The divergence of a vector field $\mathbf{F}(x,y,z)$ is:
$$\nabla \cdot \mathbf{F} = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z}$$

### 3. Curl
The curl of a vector field $\mathbf{F}(x,y,z)$ is:
$$\nabla \times \mathbf{F} = \begin{vmatrix} 
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
\frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\
F_x & F_y & F_z
\end{vmatrix}$$

## Differential Geometry

### 1. First Fundamental Form
For a surface parametrized by $\mathbf{r}(u,v)$, the first fundamental form is:
$$I = E\,du^2 + 2F\,du\,dv + G\,dv^2$$
where:
$$E = \mathbf{r}_u \cdot \mathbf{r}_u, \quad F = \mathbf{r}_u \cdot \mathbf{r}_v, \quad G = \mathbf{r}_v \cdot \mathbf{r}_v$$

### 2. Gaussian Curvature
The Gaussian curvature $K$ is:
$$K = \frac{LN - M^2}{EG - F^2}$$

## Group Theory

### 1. Symmetry Groups
The symmetries of a square form the dihedral group $D_4$ with presentation:
$$D_4 = \langle r,s \mid r^4 = s^2 = 1, srs = r^{-1} \rangle$$

### 2. Cayley Table
For the Klein four-group $V_4$:
$$\begin{array}{c|cccc}
\cdot & e & a & b & c \\
\hline
e & e & a & b & c \\
a & a & e & c & b \\
b & b & c & e & a \\
c & c & b & a & e
\end{array}$$

## Complex Analysis

### 1. Residue Theorem
For a meromorphic function $f(z)$:
$$\oint_C f(z)\,dz = 2\pi i \sum_{k=1}^n \text{Res}(f,a_k)$$

### 2. Laurent Series
Around a singularity $a$:
$$f(z) = \sum_{n=-\infty}^{\infty} c_n(z-a)^n$$
where:
$$c_n = \frac{1}{2\pi i} \oint_C \frac{f(z)}{(z-a)^{n+1}}\,dz$$